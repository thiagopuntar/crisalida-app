module.exports = (sequelize, dataTypes) => {
  const customer = sequelize.define('customer', {
    name: dataTypes.STRING,
    phone: dataTypes.STRING,
    instagram: dataTypes.STRING
  });

  customer.associate = function(models) {
    customer.addresses = customer.hasMany(models.customerAddress, { 
      as: 'addresses',
      onDelete: 'CASCADE'
    });
  }

  return customer;
}