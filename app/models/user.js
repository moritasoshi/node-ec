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
		zipCode: {
			type: Number,
			min: [10000, "Zip code too short"],
			max: 9999999
		},
		password: {
			type: String,
			required: true
		},
		telephone: {
			type: Number,
		},
		address: [{type: Schema.Types.ObjectId, ref: "Address"}]
	},
	{
		timestamps: true
	}
);

User.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", User);
