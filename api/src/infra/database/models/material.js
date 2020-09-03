module.exports = (sequelize, dataTypes) => {
  const material = sequelize.define("material", {
    qty: dataTypes.DOUBLE,
    realQty: dataTypes.DOUBLE,
  });

  material.associate = function (models) {
    material.product = material.belongsTo(models.product);
    material.productMaterial = material.belongsTo(models.product, {
      as: "productMaterial",
      foreignKey: "materialId",
    });
    material.unit = material.belongsTo(models.productUnit, { as: "unit" });
  };

  return material;
};
