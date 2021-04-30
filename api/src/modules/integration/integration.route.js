const Controller = require("./integration.controller");

const { Router } = require("express");
const router = new Router();

router.post("/omie", Controller.startAutomation);
router.get("/flowNames", Controller.listFlowNames);

module.exports = router;
