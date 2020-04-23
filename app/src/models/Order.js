import { date } from 'quasar';

class Detail {
  constructor(detail) {
    if (detail) {
      this.id = detail.id;
      this._product = detail.product;
      this.qty = detail.qty;
      this.vl = detail.vl;
      this.comments = detail.comments;
    } else {
      this.product = null;
      this.qty = '';
      this.vl = 0.0;
    }
  }

  get product() {
    return this._product;
  }

  set product(product) {
    this._product = product;

    if (product) {
      this.vl = product.vl;
    }
  }
}

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
      this._customer = order.customer;
      this.address = order.address;
      this.details = order.details.map(d => new Detail(d));
    } else {
      this._customer = null;
      this.address = null;
      this.deliveryTax = 0;
      this.orderDate = date.formatDate(new Date(), "DD/MM/YYYY");
      this.details = [ new Detail() ];
    }
  }

  get customer() {
    return this._customer;
  }

  set customer(customer) {
    this.customer = customer;

    if (customer) {
      this.addresses = customer.addresses;
  
      const mainAddress = customer.addresses[0];
      
      if (mainAddress) {
        this.address = mainAddress;
        this.deliveryTax = mainAddress.deliveryTax;
      }
    }
  }

  get hasDelivery() {
    return this.deliveryType !== 'Retirada';
  }

  get isRealTimeDelivery() {
    return this.deliveryType === 'Pronta Entrega';
  }
}