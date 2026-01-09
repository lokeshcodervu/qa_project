module.exports = (sequelize, DataTypes) => {
  const Freelancer = sequelize.define(
    'Freelancer',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },

      displayName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      domain: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      skills: {
        type: DataTypes.JSON,
        defaultValue: [],
      },

      portfolioUrl: {
        type: DataTypes.STRING,
      },

      bio: {
        type: DataTypes.TEXT,
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      hourlyRate: {
        type: DataTypes.FLOAT,
      },

      experienceYears: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      availabilityType: {
        type: DataTypes.ENUM('FULL_TIME', 'PART_TIME', 'CUSTOM'),
        defaultValue: 'FULL_TIME',
        allowNull: false,
      },

      availableDays: {
        type: DataTypes.JSON,
        allowNull: true,
        // example: ["MONDAY", "WEDNESDAY"]
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
      tableName: 'freelancers',
    }
  );

  Freelancer.associate = (models) => {
    Freelancer.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    Freelancer.hasMany(models.Subscription, {
      foreignKey: 'userId',
      as: 'subscriptions',
    });
  };

  return Freelancer;
};
