"use strict";

const router = require("express").Router(),
	userRoutes = require("./userRoutes"),
	itemRoutes = require("./itemRoutes"),
	orderRoutes = require("./orderRoutes"),
  itemController = require("../controllers/itemController");


router.get("/", itemController.itemList);
router.use("/account", userRoutes);
router.use("/item", itemRoutes);
router.use("/order", orderRoutes);

module.exports = router;