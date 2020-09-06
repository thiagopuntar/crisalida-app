const OrderDao = require("./order.dao");
const CustomerDao = require("../customer/customer.dao");

const customerDao = new CustomerDao();
const orderDao = new OrderDao(customerDao);

class Controller {
  async list(req, res) {
    const data = await orderDao.findAll();
    res.json(data);
  }

  async insert(req, res) {
    const [data] = await orderDao.insert(req.body);
    res.json(data);
  }

  async update(req, res) {
    const data = await orderDao.findByPk(req.params.id);

    if (!data) {
      return res.status(404).send("Not found");
    }

    const newData = await orderDao.update(req.body);
    res.json(newData);
  }

  async findOne(req, res) {
    const data = await orderDao.findByPk(req.params.id);

    if (!data) {
      return res.status(404).send("Not found");
    }

    res.json(data);
  }

  async delete(req, res) {
    const data = await orderDao.del(req.params.id);
    res.json(data);
  }
}

module.exports = new Controller();
