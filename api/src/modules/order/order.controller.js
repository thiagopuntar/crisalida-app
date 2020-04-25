const { order, orderDetails, customer, setNestedArray, sequelize } = require('../../infra/database');

exports.list = async (req, res) => {
  const query = `SELECT o.id as id, orderDate, status, o.comments as comments, deliveryDate, 
  deliveryType, o.deliveryTax as deliveryTax, discount,
  c.id as 'customer.id', c.name as 'customer.name', c.phone as 'customer.phone',
  a.address as 'address.address', a.district as 'address.district',
  sum(d.vl * d.qty) as totalItens
  FROM orders o 
  LEFT JOIN orderDetails d ON o.id = d.orderId
  JOIN customers c ON c.id = o.customerId
  LEFT JOIN customerAddresses a ON a.id = o.addressId
  GROUP BY o.id, orderDate, status, comments, deliveryDate, deliveryType, deliveryTax, discount`;

  const data = await sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
    nest: true
  });

  res.json(data);
}

exports.insert = async (req, res) => {
  const data = await order.create(req.body, 
    { include: [
      order.customer,
      order.address,
      { association: order.details, as: 'details' } 
    ]
  });

  res.json(data);
}

exports.update = async (req, res) => {
  const data = await order.findByPk(req.params.id, {
    include: [
      order.customer,
      order.address
    ]
  });

  if (!data) {
    return res.status(404).send('Not found');
  }

  await setNestedArray('addDetails', req.body.details, orderDetails, data);

  const newData = await data.update(req.body, );
  res.json(newData);
}

exports.findOne = async (req, res) => {
  const data = await order.findByPk(req.params.id, { 
    include: [
      {
        association: order.customer,
        include: [ 
          {
            association: customer.addresses,
            as: 'addresses'
          } 
        ]
      },
      order.address,
      { 
        association: order.details,
        as: 'details',
        include: [ orderDetails.product ]
      }
    ]
  });

  if (!data) {
    return res.status(404).send('Not found');
  }

  res.json(data);
}

exports.delete = async (req, res) => {
  const data = await customer.destroy({ where: { id: req.params.id }});
  res.json(data);
}
