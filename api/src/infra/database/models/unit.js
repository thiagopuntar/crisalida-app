module.exports = (sequelize, dataTypes) => {
  const unit = sequelize.define('unit', {
    name: {
      type: dataTypes.STRING,
      primaryKey: true,
    },
    description: dataTypes.STRING
  });

  return unit;
}