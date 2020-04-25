module.exports = (sequelize, dataTypes) => {
  const paymentType = sequelize.define('paymentType', {
    name: dataTypes.STRING
  });

  return paymentType;
}