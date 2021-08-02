const CupomDao = require("./cupom.dao");
const cupomDao = new CupomDao();

class Controller {
  async list(req, res) {
    const data = await cupomDao.findAll();
    res.json(data);
  }
  async findById(req, res) {
    const { id } = req.params
    const [data] = await cupomDao.findByPk(id);
    res.json(data);
  }
  async create(req, res) {
    const data = await cupomDao.insert(req.body);
    res.json(data);
  }
  async update(req, res) {
    const data = await cupomDao.update(req.body);
    res.json(data);
  }
  async delete(req, res) {
    const { id } = req.params;
    const data = await cupomDao.del(id);
    res.json(data);
  }
}

module.exports = new Controller();
