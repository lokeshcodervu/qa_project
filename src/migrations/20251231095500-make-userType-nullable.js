'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Make userType nullable so registration can defer user type selection
    await queryInterface.changeColumn('users', 'userType', {
      type: Sequelize.ENUM('FREELANCER', 'COMPANY_OWNER'),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert to NOT NULL (this will fail if any NULLs exist; ensure data is cleaned before reverting)
    await queryInterface.changeColumn('users', 'userType', {
      type: Sequelize.ENUM('FREELANCER', 'COMPANY_OWNER'),
      allowNull: false,
    });
  }
};