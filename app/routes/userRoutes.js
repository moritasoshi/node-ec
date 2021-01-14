const router = require("express").Router();

router.get("/register", (req, res) => {
	res.render('./account/register.ejs');
});

module.exports = router;