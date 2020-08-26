class Material {
  constructor(material) {
    if (material) {
      this.productMaterial = material.productMaterial;
      this.qty = material.qty;
      this.realQty = material.realQty;
      this.unit = material.unit;
    } else {
      this.productMaterial = {};
      this.qty = 0.0;
      this.unit = {};
    }
  }
}

class Unit {
  constructor(unit) {
    if (unit) {
      this.name = unit.name;
      this.conversion = unit.conversion;
    } else {
      this.name = "";
      this.conversion = 0;
    }
  }
}

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
      this.composition = product.composition;
    } else {
      this.cost = 0;
      this.price = 0;
      this.isActive = true;
      this.composition = [new Material()];
      this.units = [new Unit()];
    }
  }

  addMaterial() {}

  removeMaterial() {}

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
}
