const Controller = require("./cupom.controller");

const { Router } = require("express");
const router = new Router();

router.get("/", Controller.list);
router.get("/:id", Controller.findById);
router.post("/", Controller.create);
router.put("/:id", Controller.update);
router.delete("/:id", Controller.delete);

module.exports = router;
