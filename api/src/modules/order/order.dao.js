const BaseDao = require("../../infra/database/BaseDao");

module.exports = class OrderDao extends BaseDao {
  constructor(customerDao) {
    super("orders");
    this.customerDao = customerDao;
  }

  get productSchema() {
    return {
      name: "product",
      fields: [{ productId: "id" }, "name", "unit", "price"],
      type: "object",
    };
  }

  get paymentTypeSchema() {
    return {
      name: "paymentType",
      fields: [{ paymentTypeId: "id" }, "name"],
      type: "object",
    };
  }

  get findOrderTotal() {
    return this.db
      .queryBuilder()
      .from(`orderTotal as o`)
      .join("customers as c", "o.customerId", "c.id")
      .leftJoin("customerAddresses as ca", "o.addressId", "ca.id")
      .select(
        "*",
        "o.id",
        "totalValue as totalItens",
        "o.deliveryTax as orderDeliveryTax"
      )
      .orderBy("o.deliveryDate");
  }

  async findAll() {
    const data = await this.findOrderTotal;
    return this._addCustomerOnStructure(data);
  }

  async findByPk(id) {
    const data = await this.db
      .queryBuilder()
      .from(`${this.tableName} as o`)
      .leftJoin("customerAddresses as ca", "o.addressId", "ca.id")
      .select("*", "o.id", "o.deliveryTax as orderDeliveryTax", "o.customerId")
      .where("o.id", id);

    const { addressSchema } = this.customerDao;
    const [transformed] = this.structureNestedData(data, {
      ...addressSchema,
      type: "object",
      name: "address",
    });

    const [details, payments, customer] = await Promise.all([
      this._getOrderDetails(id),
      this._getPayments(id),
      this.customerDao.findByPk(transformed.customerId),
    ]);

    transformed.details = details;
    transformed.payments = payments;
    transformed.customer = customer;

    return transformed;
  }

  async _getOrderDetails(orderId) {
    const data = await this.db
      .queryBuilder()
      .from("orderDetails as d")
      .join("products as p", "d.productId", "p.id")
      .where("d.orderId", orderId)
      .select("d.*", "p.name", "p.unit", "p.price");

    const transformed = this.structureNestedData(data, this.productSchema);
    return transformed;
  }

  async _getPayments(orderId) {
    const data = await this.db
      .queryBuilder()
      .from("payments as p")
      .join("paymentTypes as pt", "p.paymentTypeId", "pt.id")
      .where("p.orderId", orderId)
      .select("p.*", "pt.name");

    const transformed = this.structureNestedData(data, this.paymentTypeSchema);
    return transformed;
  }

  async _addCustomerOnStructure(data) {
    const { addressSchema, customerSchema } = this.customerDao;
    return this.structureNestedData(
      data,
      { ...addressSchema, type: "object", name: "address" },
      customerSchema
    );
  }

  async insert(data) {
    const { details, payments, ...order } = data;
    const trx = await this.db.transaction();

    const orderId = await this.db(this.tableName).insert(order);
    const transformedDetails = this.addParentId(details, { orderId });
    const transformedPayments = this.addParentId(payments, { orderId });

    await trx("orderDetails").insert(transformedDetails);
    await trx("payments").insert(transformedPayments);

    await trx.commit();

    const inserted = await this.findOrderTotal.where("o.id", orderId);
    return this._addCustomerOnStructure(inserted);
  }

  async update(data) {
    const { details = [], payments = [], ...order } = data;
    const trx = await this.db.transaction();

    await trx(this.tableName).where("id", order.id).update(order);
    await this.updateNestedData(trx, details, "orderDetails");
    await this.updateNestedData(trx, payments, "payments");

    await trx.commit();

    const inserted = await this.findOrderTotal.where("o.id", order.id);
    return this._addCustomerOnStructure(inserted);
  }

  async getOrdersToRoute(ids) {
    const data = await this.db
      .queryBuilder()
      .from("orderTotal as o")
      .join("customerAddresses as ca", "o.addressId", "ca.id")
      .join("customers as c", "o.customerId", "c.id")
      .whereIn("o.id", ids.split(","))
      .select("*", "o.id", "o.deliveryTax as orderDeliveryTax");

    return this._addCustomerOnStructure(data);
  }
};
