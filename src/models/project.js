// module.exports = (sequelize, DataTypes) => {
//   const Project = sequelize.define(
//     'Project',
//     {
//       id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
//       name: { type: DataTypes.STRING, allowNull: false },
//       url: DataTypes.STRING,
//       scope: DataTypes.STRING,
//       testTypes: { type: DataTypes.JSON, defaultValue: [] },
//       mode: { type: DataTypes.STRING, defaultValue: 'Manual' },
//       status: { type: DataTypes.STRING, defaultValue: 'Active' },
//       progress: { type: DataTypes.INTEGER, defaultValue: 0 },
//       aiCoverage: { type: DataTypes.INTEGER, defaultValue: 0 },
//       totalTestCases: { type: DataTypes.INTEGER, defaultValue: 0 },
//       passedTests: { type: DataTypes.INTEGER, defaultValue: 0 },
//       failedTests: { type: DataTypes.INTEGER, defaultValue: 0 },
//       pendingTests: { type: DataTypes.INTEGER, defaultValue: 0 },
//       companyId: { type: DataTypes.UUID, allowNull: true },
//       createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
//       updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
//     },
//     { tableName: 'projects', indexes: [{ fields: ['companyId'] }] }
//   );

//   Project.associate = (models) => {
//     Project.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
//     Project.belongsToMany(models.User, {
//       through: 'project_assignments',
//       as: 'assignedUsers',
//       foreignKey: 'projectId',
//       otherKey: 'userId',
//     });
//     Project.hasMany(models.TestCase, { foreignKey: 'projectId', as: 'testCases' });
//     Project.hasMany(models.Issue, { foreignKey: 'projectId', as: 'issues' });
//     Project.hasMany(models.Task, { foreignKey: 'projectId', as: 'tasks' });
//   };

//   return Project;
// };