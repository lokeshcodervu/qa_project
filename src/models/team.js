// module.exports = (sequelize, DataTypes) => {
//   const Team = sequelize.define(
//     'Team',
//     {
//       id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
//       name: { type: DataTypes.STRING, allowNull: false },
//       ownerUserId: { type: DataTypes.UUID, allowNull: true },
//       ownerCompanyId: { type: DataTypes.UUID, allowNull: true },
//       type: { type: DataTypes.STRING, allowNull: true },
//       createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
//       updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
//     },
//     { tableName: 'teams' }
//   );

//   Team.associate = (models) => {
//     Team.belongsTo(models.User, { foreignKey: 'ownerUserId', as: 'ownerUser' });
//     Team.belongsTo(models.Company, { foreignKey: 'ownerCompanyId', as: 'ownerCompany' });
//     Team.belongsToMany(models.User, {
//       through: 'team_members',
//       as: 'members',
//       foreignKey: 'teamId',
//       otherKey: 'userId',
//     });
//   };

//   return Team;
// };