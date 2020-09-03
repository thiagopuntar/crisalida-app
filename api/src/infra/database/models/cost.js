module.exports = (sequelize, dataTypes) => {
  const cost = sequelize.define("cost", {
    previousValue: dataTypes.DECIMAL(10, 2),
    currentValue: dataTypes.DECIMAL(10, 2),
    dt: dataTypes.DOUBLE,
  });

  cost.associate = function (models) {
    cost.product = cost.belongsTo(models.product);
  };

  return cost;
};
