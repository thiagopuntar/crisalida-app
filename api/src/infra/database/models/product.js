module.exports = (sequelize, dataTypes) => {
  const product = sequelize.define("product", {
    name: dataTypes.STRING,
    unit: dataTypes.STRING,
    type: dataTypes.STRING,
    ncm: dataTypes.STRING,
    cfop: dataTypes.STRING,
    cost: dataTypes.DECIMAL(10, 2),
    price: dataTypes.DECIMAL(10, 2),
    productionQty: dataTypes.DOUBLE,
    minStock: dataTypes.DOUBLE,
    initialStock: dataTypes.DOUBLE,
    isActive: dataTypes.BOOLEAN,
  });

  product.associate = function (models) {
    product.suppliers = product.belongsToMany(models.supplier, {
      through: "productSuppliers",
      as: "suppliers",
    });

    product.family = product.belongsTo(models.family);
  };

  return product;
};
