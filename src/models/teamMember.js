// module.exports = (sequelize, DataTypes) => {
//   const TeamMember = sequelize.define(
//     'TeamMember',
//     {
//       id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
//       teamId: { type: DataTypes.UUID, allowNull: false, unique: 'team_user_unique' },
//       userId: { type: DataTypes.UUID, allowNull: false, unique: 'team_user_unique' },
//       role: { type: DataTypes.ENUM('ADMIN','MEMBER','MANAGER'), defaultValue: 'MEMBER' },
//       joinedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
//     },
//     {
//       tableName: 'team_members',
//       indexes: [{ fields: ['teamId'] }, { fields: ['userId'] }],
//     }
//   );

//   TeamMember.associate = (models) => {
//     TeamMember.belongsTo(models.Team, { foreignKey: 'teamId' });
//     TeamMember.belongsTo(models.User, { foreignKey: 'userId' });
//   };

//   return TeamMember;
// };