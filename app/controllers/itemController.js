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
		// カテゴリー一覧を取得
		let categoryList = await Item
			.find({}, {"_id": 0, "category": 1}, (err, data) => {
				if (err) throw err;
				return data;
			});
		categoryList = categoryList.map(v => v.category);

		// 検索条件, ソート条件を生成
		const filter = {
			$and: [
				{
					$or: [
						{name: new RegExp(query.name)},
						{description: new RegExp(query.name)},
					]
				},
				{category: new RegExp(query.category)},
			]
		}
		const sortGenerate = function (order) {
			if (order === "1") return {releaseDate: -1};
			if (order === "2") return {price: 1};
			if (order === "3") return {price: -1};
			return {};
		}
		const sort = sortGenerate(query.order);

		// 商品検索
		const itemList = await Item
			.find(filter)
			.sort(sort)
			.then(data => {
				return data
			})
			.catch(err => {
				throw err
			});

		const locals = {
			itemList: itemList,
			categoryList: categoryList,
			originals: query
		}
		res.render("./item/list.ejs", locals);
	}

}
