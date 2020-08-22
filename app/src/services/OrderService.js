import Service from "./Service";

export default class OrderService extends Service {
  constructor() {
    super("orders");
  }

  openReport(id) {
    const url = `${process.env.REPORT}/order/${id}`;
    const printWindow = window.open(url, "_blank");
  }

  openOrderList(ids) {
    const url = `${process.env.REPORT}/orders/routes?ids=${ids.join(",")}`;
    window.open(url, "_blank");
  }
}
