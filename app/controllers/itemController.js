"use strict";

const Item = require("../models/item");

module.exports = {
	show: (req, res) => {
		const itemId = req.params._id;
		Item.findById(itemId, function (err, result) {
			if (err) throw err;
			res.render('./detail.ejs', result);
		});
	},
	itemList: async (req, res) => {
		const itemList = await Item.find({}, (err, data) => {
			if (err) throw err;
			return data;
		});
		const locals = {
			itemList: itemList
		}
		res.render("./item/list.ejs", locals);
	}

}
