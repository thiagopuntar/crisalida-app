const Controller = require("./loja.controller");

const { Router } = require("express");
const router = new Router();

router.get("/produtos", Controller.listProducts);
router.get("/bairros", Controller.getDistricts);
router.get("/cep/:cep", Controller.getCep);
router.post("/pedido", Controller.addOrder);

module.exports = router;
