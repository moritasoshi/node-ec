"use strict";

const mongoose = require("mongoose"),
	Schema = mongoose.Schema;

const OrderItem = new Schema(
	{
		item: {type: Schema.Types.ObjectId, ref: "Item"},
		quantity: {
			type: Number,
		},
	}
);

module.exports = mongoose.model("OrderItem", OrderItem);
