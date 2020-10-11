class Material {
  constructor(material) {
    if (material) {
      this.id = material.id;
      this._productMaterial = material.productMaterial;
      this.qty = material.qty;
      this.unit = Object.keys(material.unit).length
        ? material.unit
        : { id: null, unitId: material.productMaterial.unit, conversion: 1 };
      this.deleted = false;
    } else {
      this.productMaterial = null;
      this.qty = 0.0;
      this.unit = null;
    }
    this.deleted = false;
  }

  get units() {
    if (!this.productMaterial) {
      return [];
    }

    const data = [
      {
        id: null,
        unitId: this.productMaterial.unit,
        conversion: 1
      }
    ];

    if (this.productMaterial.units) {
      data.push(...this.productMaterial.units);
    }

    return data;
  }

  get realQty() {
    return parseFloat(
      (parseFloat(this.unit.conversion || 0.0) * parseFloat(this.qty)).toFixed(
        3
      )
    );
  }

  get partialValue() {
    if (!this.unit) {
      return "0.00";
    }

    return (this.realQty * parseFloat(this.productMaterial.cost)).toFixed(2);
  }

  get productMaterial() {
    return this._productMaterial;
  }

  set productMaterial(material) {
    this.unit = null;
    this._productMaterial = material;
  }

  toJSON() {
    const { _productMaterial, unit, ...obj } = this;
    obj.materialId = _productMaterial.id;
    obj.unitId = unit ? unit.id : null;

    return obj;
  }
}

class Unit {
  constructor(unit) {
    if (unit) {
      this.id = unit.id;
      this.unitId = unit.unitId;
      this.conversion = unit.conversion;
    } else {
      this.unitId = null;
      this.conversion = 0;
    }
    this.deleted = false;
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
      this.minStock = product.minStock;
      this.initialStock = product.initialStock;
      this.isActive = !!product.isActive;
      this.cfop = product.cfop;
      this.ncm = product.ncm;
      this._family = product.family;
      this._composition = product.composition
        ? product.composition.map(x => new Material(x))
        : [];
      this._units = product.units ? product.units.map(x => new Unit(x)) : [];
      this.productionYield = product.productionYield || 1;
    } else {
      this.name = "";
      this._type = "";
      this._family = null;
      this.cost = 0;
      this.price = 0;
      this.isActive = true;
      this._composition = [];
      this._units = [];
      this.productionYield = 1;
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

  static copy(source) {
    const { id, ...product } = source;
    product.composition.forEach(x => delete x.id);
    product.units.forEach(x => delete x.id);

    return new Product(product);
  }

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
    return ["Produto", "Granel", "Kit"].includes(this.type);
  }

  get isForSale() {
    return ["Produto", "Revenda", "Kit"].includes(this.type);
  }

  get calculatedCost() {
    if (!this.composition.length) {
      return 0.0;
    }
    const compositionValue = this.composition.reduce((acc, material) => {
      acc += parseFloat(material.partialValue);
      return acc;
    }, 0.0);

    return (compositionValue / this.productionYield).toFixed(2);
  }

  addMaterial() {
    this._composition.push(new Material());
  }

  removeMaterial(material) {
    material.id
      ? (material.deleted = true)
      : this._composition.splice(this._composition.indexOf(material), 1);
  }

  setCost() {
    if (this.hasComposition) {
      this.cost = this.calculatedCost;
    }
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
    obj.familyId = _family ? _family.id : null;
    obj.composition = _composition.map(x => ({
      ...x.toJSON(),
      productId: this.id
    }));
    obj.units = _units.map(x => ({ ...x, productId: this.id }));

    return obj;
  }
}
