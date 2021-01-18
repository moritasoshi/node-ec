"use strict";

const router = require("express").Router(),
	userRoutes = require("./userRoutes"),
	addressRoutes = require("./addressRoutes"),
	itemRoutes = require("./itemRoutes");


router.use("/account", userRoutes);
router.use("/address", addressRoutes);
router.use("/item", itemRoutes);

module.exports = router;