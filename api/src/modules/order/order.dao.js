const BaseDao = require("../../infra/database/BaseDao");

module.exports = class OrderDao extends BaseDao {
  constructor(customerDao, productionDao, stockMovementDao) {
    super("orders");
    this.customerDao = customerDao;
    this.productionDao = productionDao;
    this.stockMovementDao = stockMovementDao;
  }

  get productSchema() {
    return {
      name: "product",
      fields: [{ productId: "id" }, "name", "unit", "price", "ncm", "cfop"],
      type: "object",
    };
  }

  get paymentTypeSchema() {
    return {
      name: "paymentType",
      fields: [
        { paymentTypeId: "id" },
        "name",
        "forma_pagamento",
        "bandeira_operadora",
      ],
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
  // FIND ALL
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
      .select("d.*", "p.name", "p.unit", "p.price", "p.ncm", "p.cfop");

    const transformed = this.structureNestedData(data, this.productSchema);
    return transformed;
  }

  async _getPayments(orderId) {
    const data = await this.db
      .queryBuilder()
      .from("payments as p")
      .join("paymentTypes as pt", "p.paymentTypeId", "pt.id")
      .where("p.orderId", orderId)
      .select("p.*", "pt.name", "pt.forma_pagamento", "pt.bandeira_operadora");

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

    const orderId = await trx(this.tableName).insert(order);
    const transformedDetails = this.addParentId(details, { orderId });
    const transformedPayments = this.addParentId(payments, { orderId });

    await trx("orderDetails").insert(transformedDetails);
    await trx("payments").insert(transformedPayments);

    if (data.status > 1) {
      await this.updateStock(trx, transformedDetails, orderId);
    }

    await trx.commit();

    const inserted = await this.findOrderTotal.where("o.id", orderId);
    return this._addCustomerOnStructure(inserted);
  }

  async update(data) {
    const { details = [], payments = [], ...order } = data;
    const trx = await this.db.transaction();

    await trx(this.tableName).where("id", order.id).update(order);
    await this.stockMovementDao.removeFromRef(order.id, trx);
    await this.updateNestedData(trx, details, "orderDetails");
    await this.updateNestedData(trx, payments, "payments");

    if (data.status > 1) {
      await this.updateStock(trx, details, order.id);
    }

    await trx.commit();

    const inserted = await this.findOrderTotal.where("o.id", order.id);
    return this._addCustomerOnStructure(inserted);
  }

  async updateNfce(data) {
    const updated = await super.update(data);
    return updated;
  }

  async updateStock(trx, details, orderId) {
    for (const detail of details) {
      const [product] = await trx("products").where("id", detail.productId);

      if (product.type === "Kit") {
        const composition = await this.productionDao.getKitComposition(
          detail.productId,
          trx
        );
        const stockData = composition.map((x) => {
          return {
            qty: (parseFloat(x.qty) * detail.qty * -1).toFixed(3),
            productId: x.id,
            ref: orderId,
            moveType: "V",
          };
        });

        await this.stockMovementDao.insert(stockData, trx);
        continue;
      }

      const stockData = {
        qty: (detail.qty * -1).toFixed(3),
        productId: detail.productId,
        ref: orderId,
        moveType: "V",
      };

      await this.stockMovementDao.insert(stockData, trx);
    }
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
