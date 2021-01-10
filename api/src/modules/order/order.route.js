const Controller = require("./order.controller");

const { Router } = require("express");
const router = new Router();

router.get("/", Controller.list);
router.get("/districts", Controller.listDistricts);
router.post("/", Controller.insert);

router.put("/:id", Controller.update);
router.get("/:id", Controller.findOne);
router.delete("/:id", Controller.delete);

module.exports = router;
