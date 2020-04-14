const Controller = require('../../infra/shared/Controller');
const Service = require('./product.service');


module.exports = class ProductController extends Controller {
  constructor() {
    super(Service);
  }
}