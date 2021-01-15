"use strict";

const mongoose = require("mongoose"),
  Schema = mongoose.Schema;
  
const Item = new Schema(
  {
    name: {
      type: String,
    },
    price: {
      type: Number,
    },
    releaseDate: {
      type: String,
    },
    category: {
      type: String,
    },
    description: {
      type: String,
    },
    photoURL: {
      type: String,
    }
  }
);

module.exports = mongoose.model("Item", Item);