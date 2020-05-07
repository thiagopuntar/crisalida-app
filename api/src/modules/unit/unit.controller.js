const { unit } = require('../../infra/database');

exports.list = async (req, res) => {
  const data = await unit.findAll();
  res.json(data.map(x => x.name));
}

exports.insert = async (req, res) => {
  const data = await unit.create(req.body);
  res.json(data);
}

exports.update = async (req, res) => {
  const data = await unit.findByPk(req.params.id);

  if (!data) {
    return res.status(404).send('Not found');
  }

  const newData = await data.update(req.body);
  res.json(newData);
}
