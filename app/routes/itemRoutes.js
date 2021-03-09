const router = require("express").Router(),
	itemController = require("../controllers/itemController");

router.get("/:_id", itemController.show);

module.exports = router;