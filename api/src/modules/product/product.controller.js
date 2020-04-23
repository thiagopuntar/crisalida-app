const { product } = require('../../infra/database');

exports.list = async (req, res) => {
  const data = await product.findAll();
  res.json(data);
}

exports.insert = async (req, res) => {
  const data = await product.create(req.body);
  res.json(data);
}

exports.update = async (req, res) => {
  const data = await product.findByPk(req.params.id);

  if (!data) {
    return res.status(404).send('Not found');
  }

  const newData = await data.update(req.body);
  res.json(newData);
}
