"use strict";

//const axiosController = require("../controllers/axiosController");

const router = require("express").Router(),
	userRoutes = require("./userRoutes"),
	itemRoutes = require("./itemRoutes"),
	orderRoutes = require("./orderRoutes"),
  itemController = require("../controllers/itemController"),
  axiosController = require("../controllers/axiosController");
  


router.get("/", itemController.itemList);
router.use("/account", userRoutes);
router.use("/item", itemRoutes);
router.use("/order", orderRoutes);
router.post("/ajax", axiosController.real);

module.exports = router;