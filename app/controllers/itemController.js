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
