require("dotenv").config();
const dayjs = require("dayjs");
const businessDays = require("../../utils/businessDays");

const OmieService = require("./OmieService");
const OmieDao = require("./OmieDao");
const OrderDao = require("../../modules/order/order.dao");
const CustomerDao = require("../../modules/customer/customer.dao");
const logger = require("../logger/Logger")("automationLogger");

const omieService = new OmieService();
const omieDao = new OmieDao();
const customerDao = new CustomerDao();
const orderDao = new OrderDao(customerDao);

class Automation {
  async run() {
    try {
      await this.createCustomers();
      await this.createProducts();
      await this.createOrders();
      // await this.updateOrders();
      // await this.invoiceOrders();
      // await this.finishPayments();
      console.log("Done");
      process.exit(0);
    } catch (error) {
      logger.error(error);
    }
  }

  async createCustomers() {
    const customers = await omieDao.listCustomers();
    const customersSave = customers.map(async (customer) => {
      try {
        const { codigo_cliente_omie } = await omieService.insertCustomer(
          customer
        );

        await omieDao.updateCustomer({
          id: customer.codigo_cliente_integracao,
          omieId: codigo_cliente_omie,
        });
      } catch (error) {
        logger.error(error);
      }
    });

    await Promise.all(customersSave);
  }

  async createProducts() {
    const products = await omieDao.listProducts();
    const productsSave = products.map(async (product) => {
      try {
        const { codigo_produto } = await omieService.insertProduct(product);

        await omieDao.updateProduct({
          id: product.id,
          omieId: codigo_produto,
        });
      } catch (error) {
        logger.error(error);
      }
    });

    await Promise.all(productsSave);
  }

  async createOrders() {
    // const ordersId = await omieDao.listOrdersToInsert();
    const ordersId = [673];

    const ordersSave = ordersId.map(async (id) => {
      try {
        const order = await orderDao.findByPk(id);
        const transformed = this._transformOrder(order);

        const { codigo_pedido } = await omieService.insertPedido(transformed);

        await omieDao.updateOrder({
          id,
          omieId: codigo_pedido,
        });
      } catch (error) {
        logger.error(error);
      }
    });

    await Promise.all(ordersSave);
  }

  async updateOrders() {
    // const ordersId = await omieDao.listOrdersToUpdate();
    const ordersId = [664];

    const ordersSave = ordersId.map(async (id) => {
      try {
        const order = await orderDao.findByPk(id);
        const transformed = this._transformOrder(order);

        const { codigo_pedido } = await omieService.insertPedido(transformed);

        await omieDao.updateOrder({
          id,
          omieId: codigo_pedido,
          omieFinanceiroId: 1,
        });
      } catch (error) {
        logger.error(error);
      }
    });

    await Promise.all(ordersSave);
  }

  async invoiceOrders() {
    // const ordersId = await omieDao.listOrdersToInvoice();
    const ordersId = [673];

    const ordersSave = ordersId.map(async (id) => {
      try {
        await omieService.faturarPedido(id);

        await omieDao.updateOrder({
          id,
          isOmieFaturado: 1,
        });
      } catch (error) {
        logger.error(error);
      }
    });

    await Promise.all(ordersSave);
  }

  async finishPayments() {
    await omieService.getContasReceber(async (contasReceber) => {
      try {
        for (const contaReceberOmie of contasReceber) {
          const pagamentos = await omieDao.listPayments(
            contaReceberOmie.nCodPedido
          );
        }
      } catch (error) {
        logger.error(error);
      }
    });
  }

  _sumTotalOrder(order) {
    const totalProductValue = order.details.reduce(
      (acc, cur) => acc + cur.qty * parseFloat(cur.vl),
      0.0
    );

    return (
      totalProductValue +
      parseFloat(order.orderDeliveryTax) -
      parseFloat(order.discount)
    ).toFixed(2);
  }

  _transformOrder(order) {
    const etapas = {
      1: "20",
      2: "40",
      3: "50",
    };

    let desconto = order.discount;

    if (!order.payments.length) {
      const defaultPayment = {
        dt: order.deliveryDate,
        vl: this._sumTotalOrder(order),
        paymentType: {
          deadline: 0,
          tax: 0,
        },
      };

      order.payments.push(defaultPayment);
    }

    return {
      cabecalho: {
        codigo_pedido_integracao: order.id,
        codigo_cliente_integracao: order.customer.id,
        data_previsao: dayjs(order.deliveryDate).format("DD/MM/YYYY"),
        etapa: etapas[order.status],
        codigo_parcela: "999",
        qtde_parcelas: order.payments.length,
        origem_pedido: "API",
      },
      frete: {
        modalidade: order.deliveryType === "Retirada" ? "9" : "1",
        outras_despesas: order.orderDeliveryTax,
        veiculo_proprio: "S",
      },
      informacoes_adicionais: {
        codigo_conta_corrente: 1966403464,
        codigo_categoria: "1.01.01",
        consumidor_final: "S",
      },
      lista_parcelas: {
        parcela: order.payments.map((payment, index) => {
          const vencimento = dayjs(payment.date).add(
            payment.paymentType.deadline,
            "day"
          );

          const data_vencimento = businessDays(vencimento).format("DD/MM/YYYY");
          const isAdiantamento = payment.date < order.deliveryDate;

          return {
            numero_parcela: index + 1,
            valor: payment.vl,
            percentual: parseFloat(
              (payment.vl / this._sumTotalOrder(order)) * 100
            ).toFixed(2),
            data_vencimento,
            parcela_adiantamento: isAdiantamento ? "S" : "N",
            categoria_adiantamento: isAdiantamento ? "1.04.01" : null,
            conta_corrente_adiantamento: isAdiantamento ? "1966403980" : null,
          };
        }),
      },
      det: order.details.map((detail, index) => ({
        ide: {
          codigo_item_integracao: detail.id,
          simples_nacional: "S",
        },
        produto: {
          codigo_produto_integracao: detail.product.id,
          quantidade: detail.qty,
          valor_unitario: detail.vl,
          valor_desconto: index === 0 ? desconto : 0,
          tipo_desconto: "V",
        },
      })),
    };
  }
}

new Automation().run();
