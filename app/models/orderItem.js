"use strict";

const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
  
const OrderItem = new Schema(
  {
    item: [{
      name: {type: String, ref: 'Item'},
      price: {type: Number, ref: 'Item'},
      releaseDate: {type: String, ref: 'Item'},
      category: {type: String, ref: 'Item'},
      description: {type: String, ref: 'Item'},
      photoURL: {type: String, ref: 'Item'}
    }],
    quantity: {
      type: Number,
    },
  }
);

module.exports = mongoose.model("OrderItem", OrderItem);
//module.exports = mongoose.model("Item", Item);