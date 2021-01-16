const router = require("express").Router(),
	itemController = require("../controllers/itemController");

router.get("/", itemController.show);

module.exports = router;