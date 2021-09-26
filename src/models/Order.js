import { date } from "quasar";
import { dateBuilder } from "../utils/dateHelper";

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
      this.qty = 0.0;
      this.vl = 0.0;
      this.comments = "";
    }

    this.deleted = false;
    this.picked = false;
  }

  get product() {
    return this._product;
  }

  set product(product) {
    this._product = product;

    if (!product) {
      this.vl = 0.0;
    } else {
      this.vl = product.price;
    }
  }

  get unit() {
    if (this.product) {
      return this.product.unit;
    }

    return "";
  }

  get total() {
    return parseFloat((parseFloat(this.vl) * parseFloat(this.qty)).toFixed(2));
  }

  toJSON() {
    const { _product, picked, ...obj } = this;
    obj.productId = _product.id;

    return obj;
  }
}

class Payment {
  constructor(payment) {
    if (payment) {
      this.id = payment.id;
      this.vl = payment.vl;
      this.date = date.formatDate(payment.date, "DD/MM/YYYY");
      this.paymentType = payment.paymentType;
    } else {
      this.vl = 0.0;
      this.date = date.formatDate(new Date(), "DD/MM/YYYY");
      this.paymentType = null;
    }

    this.deleted = false;
  }

  toJSON() {
    const { date, paymentType, ...obj } = this;
    obj.date = dateBuilder(date);
    obj.paymentTypeId = paymentType.id;

    return obj;
  }
}

export default class Order {
  constructor(order) {
    if (order) {
      this.id = order.id;
      this.orderDate = date.formatDate(order.orderDate, "DD/MM/YYYY");
      this.comments = order.comments;
      this.deliveryDate = date.formatDate(order.deliveryDate, "DD/MM/YYYY");
      this._deliveryType = order.deliveryType;
      this._addressId = order.addressId;
      this.deliveryTax = order.orderDeliveryTax;
      this.discount = order.discount;
      this.status = parseInt(order.status);
      this._customer = order.customer;
      this._details = order.details
        ? order.details.map(d => new Detail(d))
        : [];
      this._payments = order.payments
        ? order.payments.map(p => new Payment(p))
        : [];
      this._totalItens = order.totalItens;
      this._totalPaid = order.totalPaid;
      this.paymentMethod = parseInt(order.paymentMethod);
      this.paymentMethodChosen = order.paymentMethodChosen;
      this.paymentChange = order.paymentChange;
      this.numero = order.numero;
      this.serie = order.serie;
      this.xmlPath = order.xmlPath;
      this.danfePath = order.danfePath;
      this.address = order.address;
      this.addressNumber = order.addressNumber;
      this.complement = order.complement;
      this.district = order.district;
      this.city = order.city;
      this.state = order.state;
      this.deliveryTime = order.deliveryTime
    } else {
      this._customer = null;
      this.deliveryTax = 0.0;
      this._deliveryType = null;
      this.discount = 0.0;
      this.orderDate = date.formatDate(new Date(), "DD/MM/YYYY");
      this._details = [new Detail()];
      this._payments = [];
      this.status = 1;
      this.paymentMethod = 0;
      this._addressId = null;
      this.address = null;
      this.addressNumber = null;
      this.complement = null;
      this.district = null;
      this.city = 'Juiz de Fora';
      this.state = 'MG';
      this.deliveryTime = null;
    }
  }

  static status = ["Em aberto", "Confirmado", "Separado", "Entregue"];

  get details() {
    return this._details.filter(d => !d.deleted);
  }

  get payments() {
    return this._payments.filter(p => !p.deleted);
  }

  get customer() {
    return this._customer;
  }

  set customer(customer) {
    this._customer = customer;

    if (customer && this.hasDelivery) {
      const mainAddress = customer.addresses[0];

      if (mainAddress) {
        this.setAddress(mainAddress);
      }
    }
  }

  get addressId() {
    return this._addressId;
  }

  set addressId(address) {
    this.setAddress(address);
    this._addressId = address.id;
  }

  setAddress(address) {
    this.address = address.address;
    this.addressNumber = address.number;
    this.complement = address.complement;
    this.district = address.district;
    this.city = address.city;
    this.state = address.state;
    this.deliveryTax = address.deliveryTax;
  }

  formattedAddress() {
    if (!this.address) {
      return " - ";
    }

    const { address, addressNumber } = this;

    let formated = address;
    formated += addressNumber ? `, ${addressNumber}` : "";

    return formated;
  }

  // get address() {
  //   return this._address;
  // }

  // set address(address) {
  //   this._address = address;
  //   const { deliveryTax } = address || {};

  //   if (deliveryTax) {
  //     this.deliveryTax = deliveryTax;
  //   }
  // }

  get deliveryType() {
    return this._deliveryType;
  }

  set deliveryType(deliveryType) {
    this._deliveryType = deliveryType;

    if (deliveryType === "Retirada") {
      this.address = null;
      this.deliveryTax = 0.0;
    }
  }

  get hasDelivery() {
    return this.deliveryType !== "Retirada";
  }

  get isRealTimeDelivery() {
    return this.deliveryType === "Pronta Entrega";
  }

  get total() {
    const totalItens =
      this._totalItens ||
      this.details.reduce((total, item) => {
        total += item.total;
        return total;
      }, 0.0);

    return (
      parseFloat(totalItens) +
      parseFloat(this.deliveryTax) -
      parseFloat(this.discount)
    );
  }

  get totalPaid() {
    return !this._totalPaid
      ? parseFloat(
          this._payments.reduce((total, payment) => {
            total += parseFloat(payment.vl);
            return total;
          }, 0.0)
        )
      : parseFloat(this._totalPaid);
  }

  get remainingPayment() {
    return this.total - this.totalPaid;
  }

  get isCreditCard() {
    return this.paymentMethod > 0;
  }

  addDetail() {
    this._details.push(new Detail());
  }

  removeDetail(detail) {
    if (detail.id) {
      detail.deleted = true;
    } else {
      this._details.splice(this._details.indexOf(detail), 1);
    }
  }

  addPayment() {
    this._payments.push(new Payment());
  }

  removePayment(payment) {
    if (payment.id) {
      payment.deleted = true;
    } else {
      this._payments.splice(this._payments.indexOf(payment), 1);
    }
  }

  toJSON() {
    const {
      _customer,
      _deliveryType,
      _addressId,
      orderDate,
      deliveryDate,
      _details,
      _payments,
      paymentMethod,
      paymentMethodChosen,
      xmlPath,
      danfePath,
      ...obj
    } = this;

    obj.paymentMethod = paymentMethodChosen;
    obj.addressId = _addressId;
    obj.customerId = _customer && _customer.id;
    obj.orderDate = dateBuilder(orderDate);
    obj.deliveryDate = dateBuilder(deliveryDate);
    obj.deliveryType = _deliveryType;
    obj.details = _details
      .filter(x => x.product)
      .map(x => ({ ...x.toJSON(), orderId: this.id }));
    obj.payments = _payments
      .filter(x => !!x.vl)
      .map(x => ({ ...x.toJSON(), orderId: this.id }));

    return obj;
  }
}
