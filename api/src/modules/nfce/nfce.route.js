const Controller = require("./nfce.controller");
const controller = new Controller();

const { Router } = require("express");
const router = new Router();

router.post("/:id", controller.createNfce);

module.exports = router;
