const router = require("express").Router(),
	orderController = require("../controllers/orderController"),
	authenticate = require("../lib/security/authenticate");

router.get("/", authenticate.ensureAuthenticated, orderController.index);
router.post("/add", authenticate.ensureAuthenticated, orderController.add);
router.post("/change", orderController.change);
router.post("/confirm", orderController.confirm);
router.post("/determine", orderController.determine);

module.exports = router;