const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('./connection.js');

const db = {};

const modelsPath = path.resolve(__dirname, 'models');

fs
  .readdirSync(modelsPath)
  .filter(file => (file.indexOf('.') !== 0) && (file !== path.basename(__filename)) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(modelsPath, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize.sync();

module.exports = db;