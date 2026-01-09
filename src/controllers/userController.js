const { sequelize, User, EmailOtp, Freelancer, Company, Subscription ,ForgotPasswordOtp} = require('../models');
const { sendOtpToEmail } = require('../utils/emailService');
const { FREE_TRIAL } = require('../utils/free_trial')
const { generateOtp } = require('../utils/generateOtp')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const createBasicUser = async (req, res) => {
const { name, email, password, confirmPassword } = req.body;

    try {
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: 'All fields required' });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: 'Password must include letter, number & symbol (min 8 chars)'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        // 🔎 Existing user check
        const existingUser = await User.findOne({
            where: { email: normalizedEmail }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User already registered' });
        }

        // 🧹 Clear old OTPs
        await EmailOtp.destroy({
            where: { email: normalizedEmail }
        });

        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 3 * 60 * 1000);
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedOtp = await bcrypt.hash(otp, 10);

        // 💾 Save OTP temp data
        await EmailOtp.create({
            email: normalizedEmail,
            otp:hashedOtp,
            expiresAt: otpExpiry,
            password: hashedPassword,
            userData: JSON.stringify({ name })
        });

        // 📩 Send OTP
        await sendOtpToEmail(normalizedEmail, otp);

        return res.status(200).json({
            success: true,
            message: 'OTP sent! Verify to continue',
            email: normalizedEmail
        });

    } catch (error) {
        console.error('CREATE USER ERROR:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};


const verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 🔍 Find valid OTP
    const otpRecord = await EmailOtp.findOne({
      where: {
        email: normalizedEmail,
        isUsed: false
      }
    });

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or already used OTP' });
    }

    // ⏱ Expiry check
    if (otpRecord.expiresAt < new Date()) {
      await otpRecord.destroy();
      return res.status(400).json({ error: 'OTP expired' });
    }

    // 🧾 Safe parse
    const userData = otpRecord.userData
      ? JSON.parse(otpRecord.userData)
      : {};

    const user = await sequelize.transaction(async (t) => {

      const newUser = await User.create({
        name: userData.name,
        email: normalizedEmail,
        password: otpRecord.password,
        role: 'ClIENT',          
        status: 'PENDING_ROLE',
        isEmailVerified: true
      }, { transaction: t });

      await otpRecord.update(
        { isUsed: true },
        { transaction: t }
      );

      return newUser;
    });

    // 🎟 TEMP TOKEN (1 hour)
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        status: user.status
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      success: true,
      message: 'OTP verified! Select your role.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        nextStep: 'SELECT_ROLE'
      }
    });

  } catch (error) {
    console.error('VERIFY OTP ERROR:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

const selectRole = async (req, res) => {
  try {
    const { role, profile } = req.body;
    const user = req.user;

    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (user.userType && user.userType !== 'NONE') {
      return res.status(400).json({ error: 'Role already selected' });
    }

    if (!['FREELANCER', 'COMPANY'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const plan = role === 'FREELANCER' ? FREE_TRIAL.FREELANCER : FREE_TRIAL.COMPANY;
    if (!plan?.trialDays) {
      return res.status(500).json({ error: 'Invalid trial config' });
    }

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + plan.trialDays * 86400000);

    /* ===================== FREELANCER ===================== */
    if (role === 'FREELANCER') {

      if (!profile?.displayName || !profile?.domain || !profile?.phone || profile?.experienceYears === undefined) {
        return res.status(400).json({
          error: 'displayName, domain, phone, experienceYears required'
        });
      }

      const result = await sequelize.transaction(async (t) => {

        const freelancer = await Freelancer.create({
          userId: user.id,
          displayName: profile.displayName,
          domain: profile.domain,
          skills: profile.skills,
          portfolioUrl: profile.portfolioUrl,
          bio: profile.bio,
          phone: profile.phone,
          hourlyRate: profile.hourlyRate,
          experienceYears: profile.experienceYears
        }, { transaction: t });

        await user.update({
          role: 'ADMIN',
          userType: 'FREELANCER',
          status: 'ACTIVE'
        }, { transaction: t });

        const subscription = await Subscription.create({
          freelancerId: freelancer.id,
          planType: 'FREE_TRIAL',
          plan: 'FREE_TRIAL_FREELANCER',
          maxUsers: plan.maxUsers,
          maxProjects: plan.maxProjects,
          storageLimit: plan.storageLimit,
          aiCredits: plan.aiCredits,
          isTrial: true,
          startDate,
          endDate,
          status: 'ACTIVE'
        }, { transaction: t });

        return { freelancer, subscription };
      });

      return res.json({
        success: true,
        message: `Freelancer profile created + ${plan.trialDays}-day free trial`,
        ...result
      });
    }

    /* ===================== COMPANY ===================== */
    if (role === 'COMPANY') {

      if (!profile?.companyName) {
        return res.status(400).json({ error: 'companyName required' });
      }

      const result = await sequelize.transaction(async (t) => {

        const company = await Company.create({
          name: profile.companyName,
          ownerName: profile.ownerName || user.name,
          email: user.email,
          phone: profile.phone,
          website: profile.website,
          industry: profile.industry,
          size: profile.size,
          address: profile.address
        }, { transaction: t });

        await user.update({
          role: 'ADMIN',
          userType: 'COMPANY_OWNER',
          companyId: company.id,
          status: 'ACTIVE'
        }, { transaction: t });

        const subscription = await Subscription.create({
          companyId: company.id,
          planType: 'FREE_TRIAL',
          plan: 'FREE_TRIAL_COMPANY',
          maxUsers: plan.maxUsers,
          maxProjects: plan.maxProjects,
          storageLimit: plan.storageLimit,
          aiCredits: plan.aiCredits,
          isTrial: true,
          startDate,
          endDate,
          status: 'ACTIVE'
        }, { transaction: t });

        return { company, subscription };
      });

      return res.json({
        success: true,
        message: `Company created + ${plan.trialDays}-day free trial`,
        ...result
      });
    }

  } catch (err) {
    console.error('SELECT ROLE ERROR:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({
      where: { email: normalizedEmail },
      include: [
        { model: Freelancer, as: 'freelancer', required: false },
        { model: Company, as: 'company', required: false }
      ]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    //  Password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    //  Email verify check
    if (!user.isEmailVerified) {
      return res.status(403).json({
        error: 'Email not verified',
        nextStep: 'VERIFY_EMAIL'
      });
    }
    // ROLE NOT SELECTED → redirect to select role
    if (user.status === 'PENDING_ROLE' || !user.userType) {
      const token = jwt.sign(
        {
          userId: user.id,
          status: user.status
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        success: true,
        message: 'Role selection required',
        nextStep: 'SELECT_ROLE',
        redirectTo: '/select-role',
        token,
        user: {
          id: user.id,
          email: user.email,
          status: user.status
        }
      });
    }

  
    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Account not active' });
    }

  
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        userType: user.userType
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );


    return res.status(200).json({
      success: true,
      message: 'Login successful',
      nextStep: 'DASHBOARD',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.userType,
        freelancer: user.freelancer || null,
        company: user.company || null
      }
    });

  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const user = await User.findOne({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    
    await ForgotPasswordOtp.destroy({
      where: { email: normalizedEmail }
    });

    const otp = generateOtp(); // 6 digit
    const hashedOtp = await bcrypt.hash(otp, 10);

    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 min

    await ForgotPasswordOtp.create({
      email: normalizedEmail,
      otp: hashedOtp,
      expiresAt,
      isUsed: false
    });

    await sendOtpToEmail(normalizedEmail, otp);

    return res.status(200).json({
      success: true,
      message: 'OTP sent to email (valid for 3 minutes)'
    });

  } catch (error) {
    console.error('FORGOT PASSWORD ERROR:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};


const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const otpRecord = await ForgotPasswordOtp.findOne({
      where: {
        email: normalizedEmail,
        isUsed: false
      }
    });

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // ⏱ Expiry check (3 min)
    if (otpRecord.expiresAt < new Date()) {
      await otpRecord.destroy();
      return res.status(400).json({ error: 'OTP expired' });
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect OTP' });
    }

    await otpRecord.update({ isUsed: true });

    // 🎟 Reset token (15 min)
    const resetToken = jwt.sign(
      { email: normalizedEmail, purpose: 'RESET_PASSWORD' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '15m' }
    );

    return res.status(200).json({
      success: true,
      message: 'OTP verified',
      resetToken
    });

  } catch (error) {
    console.error('VERIFY RESET OTP ERROR:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ error: 'Token missing' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.purpose !== 'RESET_PASSWORD')
      return res.status(401).json({ error: 'Invalid token' });

    if (!newPassword || !confirmPassword)
      return res.status(400).json({ error: 'Passwords required' });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ error: 'Passwords do not match' });

    const strongPassword =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

    if (!strongPassword.test(newPassword))
      return res.status(400).json({
        error: 'Password must be strong'
      });

    const user = await User.findOne({
      where: { email: decoded.email }
    });

    if (!user)
      return res.status(404).json({ error: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    // 🧹 clear OTPs
    await ForgotPasswordOtp.destroy({
      where: { email: decoded.email }
    });

    return res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error('RESET PASSWORD ERROR:', error);
    return res.status(401).json({
      error: 'Invalid or expired token'
    });
  }
};







module.exports = { createBasicUser , verifyEmailOtp , selectRole , loginUser, forgotPassword , verifyResetOtp , resetPassword };