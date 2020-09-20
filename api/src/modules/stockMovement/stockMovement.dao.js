const BaseDao = require("../../infra/database/BaseDao");

module.exports = class CustomerDao extends BaseDao {
  constructor() {
    super("stockMovement");
  }

  async findAll(ids) {
    let query = this.db("stock");
    ids && query.whereIn("id", ids);

    const data = await query;

    return data;
  }
};
