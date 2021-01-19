const router = require("express").Router(),
	userController = require("../controllers/userController"),
	addressRoutes = require("../routes/addressRoutes"),
	authenticate = require("../lib/security/authenticate"),
	validate = require("../lib/validate/validate");

router.use("/address", authenticate.ensureAuthenticated ,addressRoutes);

router.get("/register", userController.toRegister);
router.post("/register", validate.validateUserRegister, userController.register, userController.toLogin);
router.get("/login", userController.toLogin);
router.post("/login", userController.login);
router.get("/logout", authenticate.ensureAuthenticated ,userController.logout);

module.exports = router;