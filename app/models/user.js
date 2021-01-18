"use strict";

const mongoose = require("mongoose"),
	Schema = mongoose.Schema;

const User = new Schema(
	{
		firstName: {
			type: String,
			trim: true
		},
		lastName: {
			type: String,
			trim: true
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		},
		addresses: [{type: Schema.Types.ObjectId, ref: "Address"}],
		defaultAddress: {type: Schema.Types.ObjectId, ref: "Address"}
	},
	{
		timestamps: true
	}
);

User.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", User);
