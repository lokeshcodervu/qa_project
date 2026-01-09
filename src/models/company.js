module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define(
    'Company',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      ownerName: {
        type: DataTypes.STRING,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      phone: {
        type: DataTypes.STRING,
      },

      website: {
        type: DataTypes.STRING,
      },

      industry: {
        type: DataTypes.STRING,
      },

      size: {
        type: DataTypes.STRING,
      },

      address: {
        type: DataTypes.TEXT,
      },

      status: {
        type: DataTypes.STRING,
        defaultValue: 'ACTIVE',
      },

      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'companies',
      indexes: [{ fields: ['email'] }],
    }
  );

  Company.associate = (models) => {
    Company.hasMany(models.User, {
      foreignKey: 'companyId',
      as: 'users',
    });

    if (models.Project) {
      Company.hasMany(models.Project, {
        foreignKey: 'companyId',
        as: 'projects',
      });
    }

    Company.hasMany(models.Subscription, {
      foreignKey: 'companyId',
      as: 'subscriptions',
    });

    if (models.Payment) {
      Company.hasMany(models.Payment, {
        foreignKey: 'companyId',
        as: 'payments',
      });
    }
  };

  return Company;
};
