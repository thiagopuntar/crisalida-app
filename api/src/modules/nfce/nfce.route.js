const Controller = require("./nfce.controller");

const { Router } = require("express");
const router = new Router();

router.get("/", Controller.getNfce);
router.post("/:id", Controller.createNfce);

module.exports = router;
