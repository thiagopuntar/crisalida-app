const db = require("./db");

module.exports = class BaseDao {
  constructor(tableName) {
    this.db = db;
    this.tableName = tableName;
  }

  async findAll() {
    return this.db(this.tableName);
  }

  async findByPk(id) {
    return this.db(this.tableName).where("id", id);
  }

  async insert(data) {
    const id = this.db(this.tableName).insert(data);
    return this.findByPk(id);
  }

  async update(data) {
    await this.db(this.tableName).where(id, data.id).update(data);
    return this.findByPk(data.id);
  }

  async del(id) {
    return this.db(this.tableName).where("id", id).del();
  }

  async updateNestedData(trx, data, tableName) {
    const { deleted, created, updated } = data.reduce(
      (objs, item) => {
        if (item.deleted) {
          objs.deleted.push(item.id);
          return objs;
        }

        const { deleted, ...obj } = item;
        item.id ? objs.updated.push(obj) : objs.created.push(obj);

        return objs;
      },
      { deleted: [], created: [], updated: [] }
    );

    const promises = [];
    // SQL
    promises.push(trx(tableName).whereIn("id", deleted).del());
    promises.push(trx(tableName).insert(created));

    updated.forEach((x) => {
      promises.push(trx(tableName).where("id", x.id).update(x));
    });

    return Promise.all(promises);
  }

  _nestData(item, objSchema, fieldSchema) {
    const { type, ...arraySchema } = objSchema;

    const aliasMap = arraySchema
      .filter((x) => typeof x === "object")
      .reduce((acc, x) => Object.assign(acc, x), {});

    const schema = arraySchema.map((x) =>
      typeof x === "object" ? Object.keys(x)[0] : x
    );

    return Object.keys(item).reduce(
      (acc, key) => {
        if (schema.includes(key)) {
          if (item[key] != null) {
            !acc[fieldSchema].length && acc[fieldSchema].push({});
            const alias = aliasMap[key] || key;
            acc[fieldSchema][0][alias] = item[key];
          }
        } else {
          acc[key] = item[key];
        }
        return acc;
      },
      { [fieldSchema]: [] }
    );
  }

  structureNestedData(data, ...nestedSchema) {
    return data.reduce((newData, item) => {
      const existentData = newData.find((x) => x.id === item.id);

      for (const schema of nestedSchema) {
        const [nestedField] = Object.keys(schema);
        item = this._nestData(item, schema[nestedField], nestedField);
        existentData && existentData[nestedField].push(item[nestedField][0]);
      }

      !existentData && newData.push(item);
      return newData;
    }, []);
  }

  addParentId(data, objId) {
    return data.map((item) => {
      delete item.deleted;
      return Object.assign(item, objId);
    });
  }
};
