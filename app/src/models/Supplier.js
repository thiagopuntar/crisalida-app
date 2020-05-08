export default class Supplier {
  constructor(supplier) {
    if (supplier) {
      this.id = supplier.id;
      this.name = supplier.name;
      this.address = supplier.address;
      this.city = supplier.city;
      this.state = supplier.state;
      this.phone = supplier.phone;
    } else {
      this.name = '';
    }
  }
}