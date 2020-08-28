export default class Product {
  constructor(product) {
    if (product) {
      this.id = product.id;
      this.name = product.name;
      this.unit = product.unit;
      this._type = product.type;
      this.cost = product.cost;
      this.price = product.price;
      this.productionQty = product.productionQty;
      this.minStock = product.minStock;
      this.initialStock = product.initialStock;
      this.isActive = product.isActive;
      this.cfop = product.cfop;
      this.ncm = product.ncm;
      this._family = product.family;
    } else {
      this._type = "";
      this._family = null;
      this.cost = 0;
      this.price = 0;
      this.isActive = true;
    }
  }

  static types = [
    "Insumo",
    "Consumo",
    "Embalagem",
    "Granel",
    "Produto",
    "Kit",
    "Revenda",
    "Outros"
  ];

  get type() {
    return this._type;
  }

  set type(type) {
    const cfops = {
      Produto: "5101",
      Kit: "5101",
      Revenda: "5102"
    };

    const cfop = cfops[type];
    cfop && (this.cfop = cfop);

    this._type = type;
  }

  get family() {
    return this._family;
  }

  set family(family) {
    this.ncm = family.ncm;
    this._family = family;
  }

  toJSON() {
    const { _type, _family, ...obj } = this;
    obj.type = _type;
    obj.familyId = _family.id;

    return obj;
  }
}
