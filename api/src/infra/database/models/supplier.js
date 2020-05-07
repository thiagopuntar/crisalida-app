module.exports = (sequelize, dataTypes) => {
  const supplier = sequelize.define('supplier', {
    name: dataTypes.STRING,
    tel: dataTypes.STRING,
    address: dataTypes.STRING,
    state: dataTypes.STRING
  });

  supplier.associate = function(models) {
    supplier.belongsToMany(models.product, { through: 'productSuppliers' });
  }

  return supplier;
}