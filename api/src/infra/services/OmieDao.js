const BaseDao = require("../database/BaseDao");
const dayjs = require("dayjs");

class OmieDao extends BaseDao {
  constructor(customerDao) {
    super("payments");
    this.customerDao = customerDao;
  }

  async listCustomers() {
    const customers = await this.db
      .queryBuilder()
      .from("customers as c")
      .whereNull("omieId");

    return customers.map((customer) => ({
      codigo_cliente_integracao: customer.id,
      razao_social: customer.name,
      cnpj_cpf: customer.cpf_cnpj || "",
      telefone1_ddd: customer.phone && customer.phone.slice(0, 2),
      telefone1_numero: customer.phone && customer.phone.slice(2),
    }));
  }

  updateCustomer(data) {
    return this.db("customers").where("id", data.id).update(data);
  }

  listAdiantamentos() {
    return this.db
      .queryBuilder()
      .from("payments as p")
      .join("paymentTypes as tp", "p.paymentTypeId", "tp.id")
      .join("orders as o", "p.orderId", "o.id")
      .select()
      .whereNull("p.omieId")
      .andWhere(this.db.raw("p.dt < o.deliveryDate"));
  }

  async listOrders() {
    const orders = await this.db
      .queryBuilder()
      .from("orderTotal as o")
      .whereNull("o.omieFinanceiroId")
      .andWhere("o.status", 3)
      .select("o.*");

    return orders.map((order) => ({
      codigo_lancamento_integracao: order.id,
      codigo_cliente_fornecedor_integracao: order.customerId,
      data_vencimento: dayjs(order.deliveryDate).format("DD/MM/YYYY"),
      data_emissao: dayjs(order.deliveryDate).format("DD/MM/YYYY"),
      data_previsao: dayjs(order.deliveryDate).format("DD/MM/YYYY"),
      valor_documento: order.totalValue + order.deliveryTax - order.discount,
      numero_documento: order.id,
      codigo_categoria: "1.01.01",
    }));
  }

  updateOrder(data) {
    return this.db("orders").where("id", data.id).update(data);
  }
}

module.exports = OmieDao;
