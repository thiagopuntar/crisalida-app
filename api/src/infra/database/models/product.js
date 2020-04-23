module.exports = (sequelize, dataTypes) => {
  const product = sequelize.define('product', {
    description: dataTypes.STRING,
    unit: dataTypes.STRING,
    cost: dataTypes.DECIMAL(10, 2),
    price: dataTypes.DECIMAL(10,2),
    productionQty: dataTypes.DOUBLE,
    minStock: dataTypes.DOUBLE,
    initialStock: dataTypes.DOUBLE,
    isActive: dataTypes.INTEGER
  });

  product.associate = function(models) {
    product.belongsToMany(models.supplier, { through: 'productSupplier' });
  }

  return product;
}