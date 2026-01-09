module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
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
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            role: {
                type: DataTypes.ENUM(
                    'DEVELOPER', 'QA_TESTER', 'DESIGNER', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN', 'CLIENT', 'VIEWER', 'TEAM_LEAD', 'BUSINESS_ANALYST', 'MANAGER', 'INTERN', 'HR', 'IT_SUPPORT', 'MARKETING', 'SALES', 'OTHER'
                ),
                allowNull: false,
            },
            avatar: DataTypes.STRING,
            department: DataTypes.STRING,
            userType: {
                type: DataTypes.ENUM('FREELANCER', 'COMPANY_OWNER'),
                allowNull: true,
            },
            rewardPoints: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            isEmailVerified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: 'active',
            },
            companyId: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            accessLevel: {
                type: DataTypes.ENUM('FULL_ACCESS', 'RESTRICTED', 'CUSTOM'),
                defaultValue: 'FULL_ACCESS',
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
            tableName: 'users',
            indexes: [{ fields: ['email'] }, { fields: ['companyId'] }],
        }
    );

    User.associate = (models) => {
        // Only add associations if destination models exist (some models are intentionally commented out)
        if (models.Freelancer) {
            User.hasOne(models.Freelancer, { foreignKey: 'userId', as: 'freelancer', onDelete: 'CASCADE' });
        }

        if (models.Company) {
            User.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company', onDelete: 'SET NULL' });
        }

        // Many-to-many for assigned users on projects (through table: project_assignments)
        if (models.Project) {
            User.belongsToMany(models.Project, {
                through: 'project_assignments',
                as: 'assignedProjects',
                foreignKey: 'userId',
                otherKey: 'projectId',
            });
        }

        // Teams
        if (models.Team) {
            User.belongsToMany(models.Team, {
                through: 'team_members',
                as: 'teams',
                foreignKey: 'userId',
                otherKey: 'teamId',
            });
        }

        // Associations used elsewhere
        if (models.TestCase) {
            User.hasMany(models.TestCase, { foreignKey: 'assignedToId', as: 'testCases', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
        }
        if (models.Issue) {
            User.hasMany(models.Issue, { foreignKey: 'assignedToId', as: 'assignedIssues', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
        }
        if (models.Task) {
            User.hasMany(models.Task, { foreignKey: 'assignedToId', as: 'tasks', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
        }
    };

    return User;
};