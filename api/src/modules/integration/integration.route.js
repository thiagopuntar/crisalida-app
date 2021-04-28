const Controller = require("./integration.controller");

const { Router } = require("express");
const router = new Router();

router.post("/omie", Controller.startAutomation);

module.exports = router;
