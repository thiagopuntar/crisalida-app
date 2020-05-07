module.exports = (sequelize, dataTypes) => {
  const payment = sequelize.define('payment', {
    date: dataTypes.DATE,
    vl: dataTypes.DECIMAL(10, 2)
  });

  payment.associate = function(models) {
    payment.type = payment.belongsTo(models.paymentType);
    payment.belongsTo(models.order);
  }

  return payment;
}