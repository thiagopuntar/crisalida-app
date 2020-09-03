module.exports = (sequelize, dataTypes) => {
  const unit = sequelize.define("unit", {
    name: {
      type: dataTypes.STRING,
      primaryKey: true,
    },
    description: dataTypes.STRING,
  });

  unit.associate = function (models) {
    unit.units = unit.hasMany(models.productUnit);
  };

  return unit;
};
