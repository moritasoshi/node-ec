const router = require("express").Router(),
	userController = require("../controllers/userController");

router.get("/register", userController.toRegister);
router.post("/register", userController.register, userController.toLogin);
router.get("/login", userController.toLogin);
router.get("/logout", userController.logout);

module.exports = router;