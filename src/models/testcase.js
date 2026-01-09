// module.exports = (sequelize, DataTypes) => {
//   const TestCase = sequelize.define(
//     'TestCase',
//     {
//       id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
//       projectId: { type: DataTypes.UUID, allowNull: false },
//       title: { type: DataTypes.STRING, allowNull: false },
//       description: { type: DataTypes.TEXT, allowNull: false },
//       steps: { type: DataTypes.JSON, defaultValue: [] },
//       expectedResult: { type: DataTypes.TEXT },
//       priority: { type: DataTypes.STRING, defaultValue: 'Medium' },
//       status: { type: DataTypes.STRING, defaultValue: 'Not Started' },
//       type: { type: DataTypes.STRING, defaultValue: 'Manual' },
//       testType: DataTypes.STRING,
//       assignedToId: { type: DataTypes.UUID, allowNull: true },
//       issuesFound: { type: DataTypes.INTEGER, defaultValue: 0 },
//       createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
//       updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
//     },
//     { tableName: 'test_cases', indexes: [{ fields: ['projectId'] }, { fields: ['assignedToId'] }] }
//   );

//   TestCase.associate = (models) => {
//     TestCase.belongsTo(models.Project, { foreignKey: 'projectId', as: 'project' });
//     TestCase.belongsTo(models.User, { foreignKey: 'assignedToId', as: 'assignedTo' });
//     TestCase.hasMany(models.Issue, { foreignKey: 'testCaseId', as: 'issues' });
//   };

//   return TestCase;
// };