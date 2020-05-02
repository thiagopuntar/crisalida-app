export default class Customer {
  constructor(customer) {
    if (customer) {
      this.id = customer.id;
      this.name = customer.name;
      this.phone = customer.phone;
      this.instagram = customer.instagram;
      this.addresses = customer.addresses || [];

    } else {
      this.name = '';
      this.phone = '';
      this.addresses = [];
    }
  }

  get mainAddress() {
    const main = this.addresses[0];

    if (!main) 
      return ' - ';
    
      const { address, number, complement, district } = main;

      let formated = address;
      formated += number ? `, ${number}` : '';
      formated += complement ? ` ${complement}` : '';
      formated += district ? ` - ${district}` : '';
    
      return formated;
  }

  get phoneClean() {
    if (!this.phone) {
      return '';
    }

    return this.phone.replace(/[\(\)\-\s+]/g, '');
  }
}