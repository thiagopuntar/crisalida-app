const OrderDao = require("./order.dao");
const orderDao = new OrderDao();

class Controller {
  async list(req, res) {
    const data = await orderDao.findAll();
    res.json(data);
  }

  async insert(req, res) {
    const data = await order.create(req.body, {
      include: [
        order.customer,
        order.address,
        { association: order.payments, as: "payments" },
        { association: order.details, as: "details" },
      ],
    });

    res.json(data);
  }

  async update(req, res) {
    const data = await order.findByPk(req.params.id, {
      include: [order.customer, order.address],
    });

    if (!data) {
      return res.status(404).send("Not found");
    }

    await setNestedArray("addDetails", req.body.details, orderDetails, data);
    await setNestedArray("addPayments", req.body.payments, payment, data);

    const newData = await data.update(req.body);
    res.json(newData);
  }

  async findOne(req, res) {
    const data = await order.findByPk(req.params.id, {
      include: [
        {
          association: order.customer,
          include: [
            {
              association: customer.addresses,
              as: "addresses",
            },
          ],
        },
        order.address,
        {
          association: order.details,
          as: "details",
          include: [orderDetails.product],
        },
        {
          association: order.payments,
          as: "payments",
          include: [payment.type],
        },
      ],
    });

    if (!data) {
      return res.status(404).send("Not found");
    }

    res.json(data);
  }

  async delete(req, res) {
    const data = await order.destroy({ where: { id: req.params.id } });
    res.json(data);
  }
}

module.exports = new Controller();
