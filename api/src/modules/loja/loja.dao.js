const BaseDao = require("../../infra/database/BaseDao");

module.exports = class LojaDao extends (
  BaseDao
) {
  constructor() {
    super("orders");
  }

  async listProducts() {
    return this.db("products")
      .where("isLoja", true)
      .select("id", "title", "description", "unit", "price");
  }

  async getProduct(id) {
    return this.db("products").where("id", id);
  }

  async getDistricts() {
    return this.db("districts").select("name", "tax");
  }

  async getDistrictByName(name) {
    const data = await this.db("districts").where("name", name);
    return data[0];
  }

  async getCustomerByPhone(phone) {
    const query = this.db
      .queryBuilder()
      .from("customers as c")
      .leftJoin("customerAddresses as ca", "ca.customerId", "c.id")
      .select("c.id");

    let [customer] = await query.where("phone", phone);

    if (!customer) {
      const otherPhonePattern =
        phone.length === 11
          ? phone.replace(/(\d{2})(\d{1})(\d+)/, "$1$3")
          : phone.replace(/(\d{2})(\d+)/, "$19$2");
      const customer2 = await query.where("phone", otherPhonePattern);

      customer = customer2[0];
    }

    return customer;
  }

  async getTransaction() {
    return this.db.transaction();
  }

  async createCustomer(customer) {
    const [data] = await this.db("customers").insert(customer);
    return data;
  }

  async createOrder(order, trx) {
    const data = await trx("orders").insert(order);
    return data[0];
  }

  async createOrderDetails(details, trx) {
    return trx("orderDetails").insert(details);
  }
};
