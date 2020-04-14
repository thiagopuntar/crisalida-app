const Login = require('../login/login');

const Product = require('../../modules/product/ProductRoute');

const apiRoute = 'api/v1';

module.exports = app => {
  app.use(`${apiRoute}/login`, Login);
  
  app.use(`${apiRoute}/products`, Product);
}

