'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('email_otps', 'phone');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('email_otps', 'phone', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
