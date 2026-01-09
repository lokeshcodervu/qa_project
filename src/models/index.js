const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../Config/config')[env];
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: config.logging === false ? false : console.log,
});

const db = {};

fs.readdirSync(__dirname)
  .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach((file) => {
    const modelPath = path.join(__dirname, file);
    const required = require(modelPath);

    // If the module exports a factory function (sequelize model), call it.
    if (typeof required === 'function') {
      const model = required(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    } else {
      // Skip files that are commented out or do not export a factory
      if (process.env.NODE_ENV === 'development') {
        console.log(`Skipping model file (no factory): ${file}`);
      }
    }
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
