module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('email_otps', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('email_otps', 'userData', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('email_otps', 'password');
    await queryInterface.removeColumn('email_otps', 'userData');
  },
};
