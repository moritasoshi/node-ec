"use strict";

const router = require("express").Router(),
  userRoutes = require("./userRoutes"),
  itemRoutes = require("./itemRoutes");
    

  router.use("/account", userRoutes);
  router.use("/item", itemRoutes);

module.exports = router;