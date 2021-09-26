export default class ProductionFormData {
  constructor(data) {
    if (data) {
      this.productId = data.productId;
      this.name = data.name;
      this.qty = data.qty || 0.0;
    } else {
      this.name = "";
      this.productId = null;
      this.qty = 0.0;
    }
  }
}
