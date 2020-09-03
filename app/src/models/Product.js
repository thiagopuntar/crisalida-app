class Material {
  constructor(material) {
    if (material) {
      this.id = material.id;
      this.productMaterial = material.productMaterial;
      this.qty = material.qty;
      this.realQty = material.realQty;
      this.unit = material.unit;
      this.deleted = false;
    } else {
      this.productMaterial = {};
      this.qty = 0.0;
      this.unit = null;
    }
    this.deleted = false;
  }
}

class Unit {
  constructor(unit) {
    if (unit) {
      this.id = unit.id;
      this.conversion = unit.conversion;
    } else {
      this.id = null;
      this.conversion = 0;
    }
    this.deleted = false;
  }

  toJSON() {
    const { id, ...obj } = this;
    obj.unitId = id;

    return obj;
  }
}

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
      this._composition = product.composition;
    } else {
      this._type = "";
      this._family = null;
      this.cost = 0;
      this.price = 0;
      this.isActive = true;
      this._composition = [];
      this._units = [];
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

  get composition() {
    return this._composition.filter(x => !x.deleted);
  }

  get units() {
    return this._units.filter(x => !x.deleted);
  }

  get hasComposition() {
    return ["Produto", "Granel"].includes(this.type);
  }

  addMaterial() {
    this._composition.push(new Material());
  }

  removeMaterial(material) {
    material.id
      ? (material.deleted = true)
      : this._composition.splice(this._composition.indexOf(material), 1);
  }

  addUnit() {
    this._units.push(new Unit());
  }

  removeUnit(unit) {
    unit.id
      ? (unit.deleted = true)
      : this._units.splice(this._units.indexOf(unit), 1);
  }

  toJSON() {
    const { _type, _family, _composition, _units, ...obj } = this;
    obj.type = _type;
    obj.familyId = _family && _family.id;
    obj.composition = _composition;
    obj.units = _units;

    return obj;
  }
}
