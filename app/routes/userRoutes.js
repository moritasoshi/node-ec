const router = require("express").Router(),
	userController = require("../controllers/userController"),
	addressRoutes = require("../routes/addressRoutes")
	validate = require("../validate/validate")

router.use("/address", addressRoutes);

router.get("/register", userController.toRegister);
router.post("/register", validate.validateUserRegister, userController.register, userController.toLogin);
router.get("/login", userController.toLogin);
router.post("/login", userController.login);
router.get("/logout", userController.logout);

module.exports = router;