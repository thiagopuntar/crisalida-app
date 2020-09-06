const BaseDao = require("../../infra/database/BaseDao");

module.exports = class OrderDao extends BaseDao {
  constructor() {
    super("orders");
  }

  async findAll() {
    const data = await this.db
      .queryBuilder()
      .from(`orderTotal as o`)
      .join("customers as c", "o.customerId", "c.id")
      .leftJoin("customerAddresses as ca", "o.addressId", "ca.id")
      .select(
        "*",
        "c.id as customerId",
        "ca.id as addressId",
        "totalValue as totalItens"
      )
      .orderBy("o.deliveryDate");

    return data;
  }
};
