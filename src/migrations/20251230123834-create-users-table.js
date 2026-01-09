'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      role: {
        type: Sequelize.ENUM(
          'DEVELOPER',
          'QA_TESTER',
          'DESIGNER',
          'PROJECT_MANAGER',
          'ADMIN',
          'SUPER_ADMIN',
          'CLIENT',
          'VIEWER',
          'TEAM_LEAD',
          'BUSINESS_ANALYST',
          'MANAGER',
          'INTERN',
          'HR',
          'IT_SUPPORT',
          'MARKETING',
          'SALES',
          'OTHER'
        ),
        allowNull: false,
      },

      avatar: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      department: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      userType: {
        type: Sequelize.ENUM('FREELANCER', 'COMPANY_OWNER'),
        allowNull: false,
      },

      rewardPoints: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      isEmailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      status: {
        type: Sequelize.STRING,
        defaultValue: 'active',
      },

      companyId: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      accessLevel: {
        type: Sequelize.ENUM('FULL_ACCESS', 'RESTRICTED', 'CUSTOM'),
        defaultValue: 'FULL_ACCESS',
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');

    // ENUM clean-up (MySQL fix)
    await queryInterface.sequelize.query(
      "DROP TYPE IF EXISTS enum_users_role;"
    );
    await queryInterface.sequelize.query(
      "DROP TYPE IF EXISTS enum_users_userType;"
    );
    await queryInterface.sequelize.query(
      "DROP TYPE IF EXISTS enum_users_accessLevel;"
    );
  },
};
