module.exports = (sequelize, dataTypes) => {
  const order = sequelize.define('order', {
    orderDate: dataTypes.DATE,
    status: {
      type: dataTypes.INTEGER,
      allowNull: false
    },
    comments: dataTypes.STRING,
    deliveryDate: dataTypes.DATE,
    deliveryType: {
      type: dataTypes.STRING,
      allowNull: false
    },
    deliveryTax: dataTypes.DECIMAL(10,2),
    discount: dataTypes.DECIMAL(10,2)
  });

  order.associate = function(models) {
    order.customer = order.belongsTo(models.customer);
    order.address = order.belongsTo(models.customerAddress, { as: 'address' });
    order.details = order.hasMany(models.orderDetails, { as: 'details', onDelete: 'CASCADE' });
    order.payments = order.hasMany(models.payment, { as: 'payments', onDelete: 'CASCADE' });
  }

  return order;
}