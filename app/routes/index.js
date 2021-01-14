"use strict";

const router = require("express").Router(),
	userRoutes = require("./userRoutes");

router.use("/account", userRoutes);

module.exports = router;