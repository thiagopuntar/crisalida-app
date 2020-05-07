const { paymentType } = require('../../infra/database');

exports.list = async (req, res) => {
  const data = await paymentType.findAll();
  res.json(data);
}

exports.insert = async (req, res) => {
  console.log('todo');
}

exports.update = async (req, res) => {
  console.log('todo');
}
