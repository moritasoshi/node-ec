"use strict";

const router = require("express").Router(),

  userRoutes = require("./userRoutes"),
  addressRoutes = require("./addressRoutes"),
  itemRoutes = require("./itemRoutes"),
  orderRoutes = require("./orderRoutes");
    

  router.use("/account", userRoutes);
  router.use("/address", addressRoutes);
  router.use("/item", itemRoutes);
  router.use("/order", orderRoutes);
  


module.exports = router;