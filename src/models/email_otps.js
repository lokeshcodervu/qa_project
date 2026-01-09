module.exports = (sequelize, DataTypes) => {
  const EmailOtp = sequelize.define(
    'EmailOtp',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      otp: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false, // 🔐 hashed password
      },

      userData: {
        type: DataTypes.TEXT, // JSON string
        allowNull: false,
      },

      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      isUsed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'email_otps',
      indexes: [{ fields: ['email'] }],
    }
  );

  return EmailOtp;
};
