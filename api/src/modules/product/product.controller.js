const ProductDao = require("./product.dao");

const productDao = new ProductDao();

class Controller {
  async list(req, res) {
    const data = await productDao.findAll();
    res.json(data);
  }

  async listMaterials(req, res) {
    const data = await product.findMaterials();
    res.json(data);
  }

  async insert(req, res) {
    const data = await productDao.insert(req.body);
    res.json(data);
  }

  async update(req, res) {
    const data = await productDao.findByPk(req.params.id);

    if (!data) {
      return res.status(404).send("Not found");
    }

    const [newData] = await productDao.update(req.body);
    res.json(newData);
  }

  async findOne(req, res) {
    const data = await productDao.findByPk(req.params.id);

    if (!data) {
      return res.status(404).send("Not found");
    }

    res.json(data);
  }

  async delete(req, res) {}

  async listForSaleProducts(req, res) {
    const data = await productDao.findAll({
      attributes: ["id", "name", "price", "unit"],
      where: {
        type: { [Op.in]: ["Produto", "Kit", "Outros", "Revenda"] },
        isActive: true,
      },
      order: ["name"],
    });

    res.json(data);
  }
}

module.exports = new Controller();
