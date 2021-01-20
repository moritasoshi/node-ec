const router = require("express").Router(),
	orderController = require("../controllers/orderController");

router.get("/", orderController.index);
router.post("/add", orderController.add);


module.exports = router;