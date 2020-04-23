import { date } from 'quasar';

export default class Order {
  constructor(order) {
    if (order) {
      this.id = order.id;
      this.orderDate = order.orderDate;
      this.comments = order.comments;
      this.deliveryDate = order.deliveryDate;
      this.deliveryType = order.deliveryType;
      this.deliveryTax = order.deliveryTax;
      this.discount = order.discount;
      this.status = order.status;
      this.customer = order.customer;
      this.address = order.address;
      this.details = order.details;
    } else {
      this.customer = null;
      this.orderDate = date.formatDate(new Date(), "DD/MM/YYYY");
      this.details = [];
    }
  }

  get hasDelivery() {
    return this.deliveryType !== 'Retirada'
  }
}