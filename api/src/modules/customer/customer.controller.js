const Controller = require('../../infra/shared/Controller');
const Service = require('./customer.service');


module.exports = class CustomerController extends Controller {
  constructor() {
    super(Service);
  }
}