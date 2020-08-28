const { family } = require("../../infra/database");

exports.list = async (req, res) => {
  const data = await family.findAll({ order: ["name"] });
  res.json(data);
};
