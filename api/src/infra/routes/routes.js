// const Login = require('../login/login');

const product = require('../../modules/product/product.route');
const customer = require('../../modules/customer/customer.route');

const apiRoute = '/api/v1';

module.exports = app => {
  // app.use(`${apiRoute}/login`, Login);
  
  app.use(`${apiRoute}/products`, product);
  app.use(`${apiRoute}/customers`, customer);
}

