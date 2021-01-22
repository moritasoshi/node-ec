const axiosController = require("../controllers/axiosController");

const router = require("express").Router(),
	orderController = require("../controllers/orderController"),
	authenticate = require("../lib/security/authenticate");

router.get("/", orderController.index);
router.post("/add", authenticate.ensureAuthenticated, orderController.add);
router.post("/change", orderController.change);
router.get("/confirm", orderController.confirm);



module.exports = router;