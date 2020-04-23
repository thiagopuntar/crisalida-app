export default class Product {
  constructor(product) {
    if (product) {
      this.id = product.id;
      this.name = product.name;
      this.unit = product.unit;
      this.type = product.type;
      this.cost = product.cost;
      this.price = product.price;
      this.productionQty = product.productionQty;
      this.minStock = product.minStock;
      this.initialStock = product.initialStock;
      this.isActive = product.isActive;
    } else {
      this.cost = 0;
      this.price = 0;
      this.isActive = true;
    }
  }
}