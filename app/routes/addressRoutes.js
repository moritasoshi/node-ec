const router = require("express").Router(),
	addressController = require("../controllers/addressController"),
	validate = require("../lib/validate/validate")

router.get("/", addressController.show);
router.get("/edit/:_id", addressController.toEdit);
router.post("/edit", validate.validateAddressRegister, addressController.edit);
router.get("/delete/:_id", addressController.delete);
router.get("/register", addressController.toRegister);
router.post("/register", validate.validateAddressRegister, addressController.register);


module.exports = router;