const BaseDao = require("../../infra/database/BaseDao");

module.exports = class CustomerDao extends BaseDao {
  constructor() {
    super("productions");
  }

  async listDemand() {
    const data = await this.db
      .queryBuilder()
      .from("orders as o")
      .join("orderDetails as d", "o.id", "d.orderId")
      .join("products as p", "d.productId", "p.id")
      .where("o.status", 1)
      .select("o.deliveryDate", "d.productId", "p.name", "p.type")
      .sum("d.qty as qty")
      .groupBy("o.deliveryDate", "d.productId", "p.name", "p.type")
      .orderBy("o.deliveryDate");

    const compositions = [];
    const demand = [];

    for (const item of data) {
      const { type, ...product } = item;

      if (type === "Kit") {
        let composition = compositions.find((x) => x.id === product.productId);

        if (!composition) {
          composition = await this.getKitComposition(product.productId);
          compositions.push(composition);
        }

        const products = composition.map((x) => ({
          deliveryDate: product.deliveryDate,
          productId: x.id,
          qty: (parseFloat(x.qty) * parseFloat(product.qty)).toFixed(3),
          name: x.name,
        }));

        demand.push(...products);
        continue;
      }

      demand.push(product);
    }

    return demand;
  }

  async getKitComposition(id) {
    return this.db
      .queryBuilder()
      .from("compositions as c")
      .join("products as p", "c.materialId", "p.id")
      .select("p.id", "p.name", "c.qty")
      .where("c.productId", id);
  }

  async insert(data) {
    const { addresses, ...obj } = data;
    const trx = await this.db.transaction();

    const customerId = await trx(this.tableName).insert(obj);

    const transformedAddresses = this.addParentId(addresses, { customerId });
    await trx("customerAddresses").insert(transformedAddresses);

    await trx.commit();

    return this.findByPk(customerId);
  }

  async update(data) {
    const { addresses, ...customer } = data;
    const trx = await this.db.transaction();
    await this.updateNestedData(trx, addresses, "customerAddresses");

    await trx(this.tableName).where("id", customer.id).update(customer);

    await trx.commit();

    return this.findByPk(customer.id);
  }
};
