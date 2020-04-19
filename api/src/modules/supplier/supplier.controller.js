const { Product } = require('../../infra/database');

exports.list = async (req, res) => {
  const data = await Product.findAll();
  res.json(data);
}

exports.insert = async (req, res) => {
  const data = await Product.create(req.body);
  res.json(data);
}

exports.update = async (req, res) => {
  const data = await Product.findByPk(req.params.id);

  if (!data) {
    res.status(404).send('Not found');
  }
  
  const newData = await data.update(req.body);
  res.json(newData);
}
