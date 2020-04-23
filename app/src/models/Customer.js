export default class Customer {
  constructor(customer) {
    if (customer) {
      this.id = customer.id;
      this.name = customer.name;
      this.phone = customer.phone;
      this.instagram = customer.instagram;
      this.deliveryTax = customer.deliveryTax;
      this.addresses = customer.addresses || [];

    } else {
      this.phone = '';
      this.addresses = [];
    }
  }

  get mainAddress() {
    const main = this.addresses[0];

    if (!main) 
      return ' - ';
    
    return `${main.address} ${main.number} - ${main.district}`;
  }

  get phoneClean() {
    return this.phone.replace(/[\(\)\-\s+]/g, '');
  }
}