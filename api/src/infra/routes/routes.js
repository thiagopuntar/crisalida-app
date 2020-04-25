// const Login = require('../login/login');

const product = require('../../modules/product/product.route');
const customer = require('../../modules/customer/customer.route');
const unit = require('../../modules/unit/unit.route');
const order = require('../../modules/order/order.route');

const apiRoute = '/api/v1';

module.exports = app => {
  // app.use(`${apiRoute}/login`, Login);
  
  app.use(`${apiRoute}/products`, product);
  app.use(`${apiRoute}/customers`, customer);
  app.use(`${apiRoute}/units`, unit);
  app.use(`${apiRoute}/orders`, order);
}

