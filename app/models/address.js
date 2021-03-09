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
			type: String,
			required: true,
		},
		zipCode: {
			type: String,
			required: true
		},
		address: {
			type: String,
			required: true
		},
		isDeleted: {
			type: Boolean,
			default: false,
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
