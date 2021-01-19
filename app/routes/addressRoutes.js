const router = require("express").Router(),
	addressController = require("../controllers/addressController"),
	validate = require("../validate/validate")

router.get("/", addressController.show);
router.get("/edit/:_id", addressController.toEdit);
router.post("/edit", validate.validateAddressRegister, addressController.edit, addressController.show);
router.get("/delete/:_id", addressController.delete, addressController.show);
router.get("/register", addressController.toRegister);
router.post("/register", validate.validateAddressRegister, addressController.register, addressController.show);

module.exports = router;