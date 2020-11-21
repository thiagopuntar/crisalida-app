require("dotenv").config();
const OmieService = require("./OmieService");
const OmieDao = require("./OmieDao");

const omieService = new OmieService();
const omieDao = new OmieDao();

class Automation {
  async run() {
    try {
      const customers = await omieDao.listCustomers();
      const customersSave = customers.map(async (customer) => {
        try {
          const { codigo_cliente_omie } = await omieService.insertCustomer(
            customer
          );

          await omieDao.updateCustomer({
            id: customer.id,
            omieId: codigo_cliente_omie,
          });
        } catch (error) {
          console.error(error);
        }
      });

      await Promise.all(customersSave);

      const orders = await omieDao.listOrders();
      const ordersSave = orders.map(async (order) => {
        try {
          const {
            codigo_lancamento_omie,
          } = await omieService.insertContaReceber(order);

          await omieDao.updateOrder({
            id: order.id,
            omieFinanceiroId: codigo_lancamento_omie,
          });
        } catch (error) {
          console.error(error);
        }
      });

      await Promise.all(ordersSave);

      console.log("Done");
      process.exit(0);
    } catch (error) {
      console.log(error.response.data);
    }
  }
}

new Automation().run();
