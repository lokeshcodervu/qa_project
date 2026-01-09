module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('email_otps', 'phone', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('email_otps', 'phone');
  },
};
