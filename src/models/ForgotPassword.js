module.exports = (sequelize, DataTypes) => {
  const ForgotPasswordOtp = sequelize.define('ForgotPasswordOtp', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'forgot_password_otps',
    timestamps: true
  });

  return ForgotPasswordOtp;
};
