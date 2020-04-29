const { product, Sequelize } = require('../../infra/database');
const { Op } = Sequelize

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

exports.findOne = async (req, res) => {
  const data = await product.findByPk(req.params.id);

  if (!data) {
    return res.status(404).send('Not found');
  }

  res.json(data);
}

exports.delete = async (req, res) => {
  
}

exports.listForSaleProducts = async (req, res) => {
  const data = await product.findAll({
    attributes: [ 'id', 'name', 'price', 'unit' ],
    where: { 
      type: { [Op.in]: ['Produto', 'Outros'] }, 
      isActive: true 
    },
    order: [ 'name' ]
  });

  res.json(data);
}