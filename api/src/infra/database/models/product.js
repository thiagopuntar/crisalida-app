module.exports = (sequelize, dataTypes) => {
  const Product = sequelize.define('Product', {
    description: dataTypes.STRING,
    unity: dataTypes.STRING,
    cost: dataTypes.DECIMAL(10, 2),
    price: dataTypes.DECIMAL(10,2),
    productionQty: dataTypes.DOUBLE,
    minStock: dataTypes.DOUBLE,
    initialStock: dataTypes.DOUBLE,
    isActive: dataTypes.INTEGER
  });

  return Product;
}