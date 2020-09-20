export default class Customer {
  constructor(customer) {
    if (customer) {
      this.id = customer.id;
      this.name = customer.name;
      this.phone = customer.phone;
      this.instagram = customer.instagram;
      this.addresses = customer.addresses || [];
    } else {
      this.name = "";
      this.phone = "";
      this.addresses = [];
    }
  }

  static formatAddress(data, showDistrict = true) {
    const { address, number, complement, district } = data;

    let formated = address;
    formated += number ? `, ${number}` : "";

    if (showDistrict) {
      formated += complement ? ` ${complement}` : "";
      formated += district ? ` - ${district}` : "";
    }

    return formated;
  }

  get mainAddress() {
    const main = this.addresses[0];

    if (!main) return " - ";

    return Customer.formatAddress(main);
  }

  get phoneFormated() {
    if (!this.phone) {
      return "";
    }

    return this.phone.replace(/(\d{2})(\d{5})(\d{3,4})/g, "($1) $2-$3");
  }

  toJSON() {
    const { addresses, ...obj } = this;
    obj.addresses = addresses.map(x => ({ ...x, customerId: this.id }));

    return obj;
  }
}
