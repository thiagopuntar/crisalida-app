const { customer, customerAddress, setNestedArray } = require('../../infra/database');

exports.list = async (req, res) => {
  const data = await customer.findAll({ include: [ customer.addresses ] });
  res.json(data);
}

exports.insert = async (req, res) => {
  const data = await customer.create(req.body, { include: [ { association: customer.addresses, as: 'addresses' } ] });
  res.json(data);
}

exports.update = async (req, res) => {
  const data = await customer.findByPk(req.params.id, { include: [ customer.addresses ]});

  if (!data) {
    return res.status(404).send('Not found');
  }

  await setNestedArray('addAddress', req.body.addresses, customerAddress, data);

  const newData = await data.update(req.body);
  res.json(newData);
}

exports.findOne = async (req, res) => {
  const data = await customer.findByPk(req.params.id, { include: customer.addresses });

  if (!data) {
    return res.status(404).send('Not found');
  }

  res.json(data);
}

exports.delete = async (req, res) => {
  const data = await customer.destroy({ where: { id: req.params.id }});
  res.json(data);
}
