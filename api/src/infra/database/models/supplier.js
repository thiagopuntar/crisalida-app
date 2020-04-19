module.exports = (sequelize, dataTypes) => {
  const Supplier = sequelize.define('Supplier', {
    name: dataTypes.STRING,
    tel: dataTypes.STRING,
    address: dataTypes.STRING,
    state: dataTypes.STRING
  });

  Supplier.belongsToMany(Product, { through: 'SupplierProduct' });

  return Supplier;
}