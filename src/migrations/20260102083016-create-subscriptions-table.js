'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscriptions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      companyId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      adminId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      freelancerId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      planType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      plan: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      billingCycle: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      maxUsers: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      maxProjects: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      maxTeams: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      storageLimit: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      aiCredits: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      automationLimit: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      isTrial: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      trialDaysUsed: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      renewalDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'Active',
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Optional indexes
  //   await queryInterface.addIndex('subscriptions', ['companyId']);
  //   await queryInterface.addIndex('subscriptions', ['userId']);
 },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('subscriptions');
  },
};
