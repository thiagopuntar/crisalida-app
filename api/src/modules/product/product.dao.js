const BaseDao = require("../../infra/database/BaseDao");

module.exports = class ProductDao extends BaseDao {
  constructor() {
    super("products");
  }

  async findMaterials() {
    return this.db(this.tableName)
      .whereIn("type", ["Insumo", "Granel", "Embalagem"])
      .orderBy("name");
  }

  async update(data) {
    const trx = await this.db.transaction();
    const { units, composition, ...product } = data;
    await this.updateNestedData(trx, units, "productUnits");
    // await this.updateNestedData(trx, composition, "compositions");

    await trx(this.tableName).where("id", product.id).update(product);

    await trx.commit();

    return super.findByPk(product.id);
  }

  async findByPk(id) {
    const [product] = await super.findByPk(id);
    const units = await this.db("productUnits").where("productId", id);
    const composition = await this.db("compositions").where("productId", id);

    return { ...product, units, composition };
  }

  async insert(data) {
    const { units, composition, ...product } = data;
    const trx = await this.db.transaction();

    const productId = await trx(this.tableName).insert(product);

    const unitsTransformed = units.map((unit) => {
      const { deleted, ...obj } = unit;
      obj.productId = productId;
      return obj;
    });

    await trx("productUnits").insert(unitsTransformed);

    await trx.commit();
  }

  async findAllForSale() {
    return this.db(this.tableName)
      .select("id", "name", "price", "unit")
      .whereIn("type", ["Produto", "Kit", "Outros", "Revenda"])
      .where("isActive", 1)
      .orderBy("name");
  }
};
