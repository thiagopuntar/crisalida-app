const BaseDao = require("../../infra/database/BaseDao");

module.exports = class CupomDao extends (
  BaseDao
) {
  constructor() {
    super("cupons");
  }
};
