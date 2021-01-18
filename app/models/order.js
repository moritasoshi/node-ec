"use strict";

const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
  
const Order = new Schema(
  {
    user: {
      //type: new mongoose.Types.ObjectId,
    },
    orderItems: {
      type: Array,
    },
    subTotal: {
      type: Number,
    },
    tax: {
      type: Number,
    },
    total: {
      type: Number,
    },
    orderDate: {
      type: Date,
    },
    destinationAddress: {
      //type: new mongoose.Types.ObjectId,
    },
    paymentMethod: {
      type: Number,
    },
    status: {
      type: Number,
    },
  }
);

module.exports = mongoose.model("Order", Order);