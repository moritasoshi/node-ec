const router = require("express").Router(),
	userController = require("../controllers/userController"),
	validate = require("../validate/validate")

router.get("/register", userController.toRegister);
router.post("/register", validate.validateUserRegister, userController.register, userController.toLogin);
router.get("/login", userController.toLogin);
router.get("/logout", userController.logout);

module.exports = router;