const router = require("express").Router(),
	userController = require("../controllers/userController")

router.get("/register", userController.toRegister);
router.post("/register", userController.register, userController.toLogin);

module.exports = router;