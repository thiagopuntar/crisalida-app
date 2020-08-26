module.exports = (sequelize, dataTypes) => {
  const productUnit = sequelize.define("productUnit", {
    conversion: dataTypes.DOUBLE,
  });

  productUnit.associate = function (models) {
    productUnit.product = productUnit.belongsTo(models.product);
    productUnit.unit = productUnit.belongsTo(models.unit);
  };

  return productUnit;
};
