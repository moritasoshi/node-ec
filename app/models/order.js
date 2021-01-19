"use strict";

const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
  
const Order = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId, ref: "User",
    },
    orderItems:[
      {type: Schema.Types.ObjectId, ref: "orderItem"}
    ],
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
      type: Schema.Types.ObjectId, ref: "Address",
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