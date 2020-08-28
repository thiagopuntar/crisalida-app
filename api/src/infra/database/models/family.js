module.exports = (sequelize, dataTypes) => {
  const family = sequelize.define("family", {
    name: dataTypes.STRING,
  });

  return family;
};
