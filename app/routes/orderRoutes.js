const router = require("express").Router(),
	orderController = require("../controllers/orderController");

router.get("/", orderController.index);

module.exports = router;