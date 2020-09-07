const BaseDao = require("../../infra/database/BaseDao");

module.exports = class ProductDao extends BaseDao {
  constructor() {
    super("products");
  }

  get unitSchema() {
    return {
      name: "unit",
      type: "object",
      fields: [{ cUnit: "id" }, "unitId", "conversion"],
    };
  }

  get materialUnitSchema() {
    return {
      name: "units",
      type: "array",
      fields: [{ pUnit: "id" }, "unitId", "conversion"],
    };
  }

  async findMaterials(types) {
    return this.db(this.tableName).whereIn("type", types).orderBy("name");
  }

  async update(data) {
    const trx = await this.db.transaction();
    const { units, composition, ...product } = data;
    await this.updateNestedData(trx, units, "productUnits");
    await this.updateNestedData(trx, composition, "compositions");

    await trx(this.tableName).where("id", product.id).update(product);

    await trx.commit();

    return super.findByPk(product.id);
  }

  async findByPk(id) {
    const [product] = await super.findByPk(id);
    const units = await this.db("productUnits").where("productId", id);
    const composition = await this.db
      .queryBuilder()
      .from("compositions as c")
      .leftJoin("productUnits as u", "u.id", "c.unitId")
      .select("c.*", "u.id as cUnit", "u.unitId", "u.conversion")
      .where("c.productId", id);

    const compositionMaterials = await this.db
      .queryBuilder()
      .from("products as p")
      .leftJoin("productUnits as u", "p.id", "u.productId")
      .whereIn(
        "p.id",
        composition.map((x) => x.materialId)
      )
      .select(
        "p.id",
        "p.name",
        "p.cost",
        "p.unit",
        "u.id as pUnit",
        "u.unitId",
        "u.conversion"
      );

    const transformedMaterials = this.structureNestedData(
      compositionMaterials,
      this.materialUnitSchema
    );
    const transformedComposition = this.structureNestedData(
      composition,
      this.unitSchema
    );

    const structuredComposition = transformedComposition.map((x) => {
      const productMaterial = transformedMaterials.find(
        (material) => material.id === x.materialId
      );

      return {
        ...x,
        productMaterial,
      };
    });

    return { ...product, units, composition: structuredComposition };
  }

  async insert(data) {
    const { units, composition, ...product } = data;
    const trx = await this.db.transaction();

    const productId = await trx(this.tableName).insert(product);

    const unitsTransformed = this.addParentId(units, { productId });
    const compositionTransformed = this.addParentId(composition, { productId });

    await trx("productUnits").insert(unitsTransformed);
    await trx("compositions").insert(compositionTransformed);

    await trx.commit();

    return super.findByPk(productId);
  }

  async findAllForSale() {
    return this.db(this.tableName)
      .select("id", "name", "price", "unit")
      .whereIn("type", ["Produto", "Kit", "Outros", "Revenda"])
      .where("isActive", 1)
      .orderBy("name");
  }
};
