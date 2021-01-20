"use strict";

//const { find } = require("../models/item");

const Item = require("../models/item"),
	getItemParams = body => {
		return {
			name: '1',
			price: '1',
			releaseDate: '1',
			category: '1',
			description: '1',
			photoURL: '1'
		};
	}


module.exports = {
	show: (req, res) => {
		Item.find({_id: "60011c2e19a23bdda3b07d7c"}, function (err, result) {
			if (err) throw err;

			res.render('./detail.ejs', {
				name: result[0].name,
				price: result[0].price,
				photoURL: result[0].photoURL,
				description: result[0].description,
			});
		});
	},
	itemList: async (req, res) => {
		const query = req.query;
		console.log(query.name)

		// 検索条件を生成
		let filter = {}

		const itemList = await Item.find(filter, (err, data) => {
			if (err) throw err;
			return data;
		});
		const locals = {
			itemList: itemList
		}
		res.render("./item/list.ejs", locals);
	}

}
