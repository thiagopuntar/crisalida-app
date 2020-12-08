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
      estado: "MG",
    }));
  }

  updateCustomer(data) {
    return this.db("customers").where("id", data.id).update(data);
  }

  async listProducts() {
    const products = await this.db
      .queryBuilder()
      .from("products as p")
      .whereIn("type", ["Produto", "Kit", "Revenda"])
      .andWhereRaw("omieId IS NULL")
      .andWhereNot("price", "0.00")
      .andWhere("isActive", 1);

    return products.map((product) => ({
      codigo_produto_integracao: product.id,
      descricao: product.name,
      unidade: product.unit,
      ncm: product.ncm || "21069090",
      valor_unitario: product.price,
      codigo: product.id,
    }));
  }

  updateProduct(data) {
    return this.db("products").where("id", data.id).update(data);
  }

  async listOrdersToInsert() {
    return this.db
      .queryBuilder()
      .from("orders as o")
      .whereNull("o.omieId")
      .andWhere("o.status", ">=", 1)
      .select("o.id");
  }

  async listOrdersToUpdate() {
    return this.db
      .queryBuilder()
      .from("orders as o")
      .whereNull("o.isOmieUpdated")
      .andWhere("o.status", ">=", 1)
      .select("o.id");
  }

  async listOrdersToInvoice() {
    return this.db
      .queryBuilder()
      .from("orders as o")
      .whereNull("o.isOmieFaturado")
      .andWhereRaw("o.idOmie IS NOT NULL")
      .andWhere("o.status", 3)
      .select("o.id");
  }

  updateOrder(data) {
    return this.db("orders").where("id", data.id).update(data);
  }

  async listPayments(omieOrderId) {
    return this.db
      .queryBuilder()
      .from("payments as p")
      .join("paymentTypes as pt", "p.paymentTypeId", "p.id")
      .join("orders as o")
      .select(
        "p.id",
        "p.vl",
        "p.date",
        "pt.tax",
        "pt.deadline",
        "pt.omieContaId"
      )
      .where("o.omieId", omieOrderId);
  }
}

module.exports = OmieDao;
