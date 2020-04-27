module.exports = (sequelize, dataTypes) => {
  const customerAddress = sequelize.define('customerAddress', {
    address: dataTypes.STRING,
    number: dataTypes.STRING,
    complement: dataTypes.STRING,
    district: dataTypes.STRING,
    city: dataTypes.STRING,
    state: dataTypes.STRING,
    zipCode: dataTypes.STRING,
    type: dataTypes.STRING,
    deliveryTax: dataTypes.DECIMAL(10, 2),
    contact: dataTypes.STRING
  });

  customerAddress.associate = function(models) {
    customerAddress.belongsTo(models.customer);
  }

  return customerAddress;
}