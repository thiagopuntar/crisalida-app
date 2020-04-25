module.exports = (sequelize, dataTypes) => {
  const orderDetails = sequelize.define('orderDetails', {
    qty: dataTypes.DOUBLE,
    vl: dataTypes.DECIMAL(10, 2),
    comments: dataTypes.STRING
  });

  orderDetails.associate = function(models) {
    orderDetails.belongsTo(models.order);
    orderDetails.product = orderDetails.belongsTo(models.product);
  }

  return orderDetails;
}