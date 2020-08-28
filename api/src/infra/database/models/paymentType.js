module.exports = (sequelize, dataTypes) => {
  const paymentType = sequelize.define("paymentType", {
    name: dataTypes.STRING,
    forma_pagamento: dataTypes.STRING,
    tax: dataTypes.DOUBLE,
    deadline: dataTypes.INTEGER,
    bandeira_operadora: dataTypes.STRING,
  });

  return paymentType;
};
