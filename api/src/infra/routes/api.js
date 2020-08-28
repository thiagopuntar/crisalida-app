const { Router } = require("express");
const router = new Router();

// const Login = require('../login/login');

const product = require("../../modules/product/product.route");
const customer = require("../../modules/customer/customer.route");
const unit = require("../../modules/unit/unit.route");
const order = require("../../modules/order/order.route");
const paymentType = require("../../modules/paymentType/paymentType.route");
const supplier = require("../../modules/supplier/supplier.route");
const nfce = require("../../modules/nfce/nfce.route");
const family = require("../../modules/family/family.route");

// app.use(`${apiRoute}/login`, Login);

router.use("/products", product);
router.use("/customers", customer);
router.use("/units", unit);
router.use("/orders", order);
router.use("/paymentTypes", paymentType);
router.use("/suppliers", supplier);
router.use("/nfce", nfce);
router.use("/families", family);

module.exports = router;
