module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define(
    'Subscription',
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      companyId: { type: DataTypes.UUID, allowNull: true },
      adminId: { type: DataTypes.UUID, allowNull: true },
      userId: { type: DataTypes.UUID, allowNull: true },
      freelancerId: { type: DataTypes.UUID, allowNull: true },
      planType: { type: DataTypes.STRING, allowNull: false },
      plan: DataTypes.STRING,
      billingCycle: DataTypes.STRING,
      maxUsers: DataTypes.INTEGER,
      maxProjects: DataTypes.INTEGER,
      maxTeams: DataTypes.INTEGER,
      storageLimit: DataTypes.INTEGER,
      aiCredits: DataTypes.INTEGER,
      automationLimit: DataTypes.INTEGER,
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      amount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      isTrial: { type: DataTypes.BOOLEAN, defaultValue: false },
      trialDaysUsed: { type: DataTypes.INTEGER, defaultValue: 0 },
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      renewalDate: DataTypes.DATE,
      status: { type: DataTypes.STRING, defaultValue: 'Active' },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { tableName: 'subscriptions', indexes: [{ fields: ['companyId'] }, { fields: ['userId'] }] }
  );

  Subscription.associate = (models) => {
    Subscription.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
    Subscription.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Subscription;
};