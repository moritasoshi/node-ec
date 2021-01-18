"use strict";

const mongoose = require("mongoose"),
	Schema = mongoose.Schema;

const Address = new Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		telephone: {
			type: Number,
			required: true,
		},
		zipCode: {
			type: Number,
			required: true
		},
		address: {
			type: String,
			required: true
		},
	},
	{
		timestamps: true
	}
);

Address.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("Address", Address);
