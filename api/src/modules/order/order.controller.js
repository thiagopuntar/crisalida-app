const { order, orderDetails, customer, payment, setNestedArray, sequelize } = require('../../infra/database');

exports.list = async (req, res) => {
  const query = `SELECT o.id as id, orderDate, status, o.comments as comments, deliveryDate, 
    deliveryType, o.deliveryTax as deliveryTax, discount,
    c.id as 'customer.id', c.name as 'customer.name', c.phone as 'customer.phone',
    a.address as 'address.address', a.district as 'address.district',
    sum(d.vl * d.qty) as totalItens,
    (SELECT coalesce(sum(vl),0) FROM payments p WHERE p.orderId = o.id) as totalPaid
    FROM orders o 
    LEFT JOIN orderDetails d ON o.id = d.orderId
    JOIN customers c ON c.id = o.customerId
    LEFT JOIN customerAddresses a ON a.id = o.addressId
    GROUP BY o.id, orderDate, status, comments, deliveryDate, deliveryType, deliveryTax, discount
    ORDER BY o.deliveryDate`;

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
      { association: order.payments, as: 'payments' },
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
  await setNestedArray('addPayments', req.body.payments, payment, data);

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
      },
      {
        association: order.payments,
        as: 'payments',
        include: [ payment.type ]
      }
    ]
  });

  if (!data) {
    return res.status(404).send('Not found');
  }

  res.json(data);
}

exports.delete = async (req, res) => {
  const data = await order.destroy({ where: { id: req.params.id }});
  res.json(data);
}