module.exports = (sequelize, dataTypes) => {
  const productUnit = sequelize.define("productUnit", {
    conversion: dataTypes.DOUBLE,
  });

  productUnit.associate = function (models) {
    productUnit.belongsTo(models.product);
    productUnit.belongsTo(models.unit);
  };

  return productUnit;
};
