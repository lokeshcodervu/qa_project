'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('freelancers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      displayName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      domain: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      skills: {
        type: Sequelize.JSON,
        defaultValue: [],
      },
      portfolioUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hourlyRate: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      experienceYears: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      availabilityType: {
        type: Sequelize.ENUM('FULL_TIME', 'PART_TIME', 'CUSTOM'),
        defaultValue: 'FULL_TIME',
        allowNull: false,
      },
      availableDays: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('freelancers');
  }
};
