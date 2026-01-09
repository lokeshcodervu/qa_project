const { User, Subscription } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const superAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password required' 
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    
    const superAdmin = await User.findOne({
      where: { 
        email: normalizedEmail,
        role: 'SUPER_ADMIN',  
        status: 'ACTIVE'
      }
    });

    if (!superAdmin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials or not authorized' 
      });
    }

    
    const isPasswordValid = await bcrypt.compare(password, superAdmin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid password' 
      });
    }

   
    const token = jwt.sign(
      { 
        userId: superAdmin.id, 
        email: superAdmin.email, 
        role: superAdmin.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Secure Cookie
    res.cookie('superAdminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'SuperAdmin login successful!',
      token,
      user: {
        id: superAdmin.id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role
      }
    });

  } catch (error) {
    console.error('SUPERADMIN LOGIN ERROR:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};


const getDashboardStats = async (req, res) => {
  try {
    const startTime = Date.now();
    
    const stats = await Promise.all([
      User.count({ where: { status: 'ACTIVE' } }),
      User.count({ where: { userType: 'FREELANCER' } }),
      User.count({ where: { userType: 'COMPANY_OWNER' } }),
      User.count({ where: { role: 'CLIENT', userType: null } }),
      Subscription.count({ where: { status: 'ACTIVE', isTrial: false } }),
      Subscription.count({ where: { isTrial: true } })
    ]);

    const responseTime = Date.now() - startTime;
    console.log(`📊 Dashboard stats loaded in ${responseTime}ms`);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      stats: {
        totalUsers: stats[0],
        freelancers: stats[1],
        companies: stats[2],
        clients: stats[3],
        paidSubs: stats[4],
        trialUsers: stats[5]
      }
    });
  } catch (error) {
    console.error('DASHBOARD STATS ERROR:', error);
    res.status(500).json({ 
      success: false,
      error: 'Dashboard unavailable',
      timestamp: new Date().toISOString()
    });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status, search } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) where[Op.or] = [{ email: { [Op.iLike]: `%${search}%` } }, { name: { [Op.iLike]: `%${search}%` } }];
    
    const { count, rows } = await User.findAndCountAll({
      where,
      offset: +offset,
      limit: +limit,
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      users: rows,
      pagination: { total: count, page: +page, limit: +limit }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};
// const toggleUserStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findByPk(id);
    
//     if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
//     user.status = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
//     await user.save();
    
//     res.json({ success: true, message: 'User status updated', user });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Failed to update status' });
//   }
// };


module.exports = {superAdminLogin,getDashboardStats,getAllUsers
}                                                                     





