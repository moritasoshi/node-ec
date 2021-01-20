const router = require("express").Router(),
	orderController = require("../controllers/orderController"),
	authenticate = require("../lib/security/authenticate");

router.get("/", orderController.index);
router.post("/add", authenticate.ensureAuthenticated, orderController.add);


module.exports = router;