"use strict";

const Item = require("../models/item"),
	itemsPerPage = 8;

module.exports = {
	show: async (req, res) => {
		const itemId = req.params._id;
		const result = await Item.findById(itemId, function (err, result) {
			if (err) throw err;
		});
		res.render('./item/detail.ejs', result);
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

		// ページの処理
		const total = await Item.find(filter).count();
		const totalPage = Math.ceil(total / itemsPerPage);
		let page = query.page;
		if (!page || page <= 0) {
			page = 1;
		} else if (page > totalPage) {
			page = totalPage;
		}
		page = parseInt(page)
		const skipCount = (page - 1) * itemsPerPage;

		// 商品検索
		const itemList = await Item
			.find(filter)
			.sort(sort)
			.skip(skipCount)
			.limit(itemsPerPage)
			.then(data => {
				return data
			})
			.catch(err => {
				throw err
			});

		const locals = {
			itemList: itemList,
			totalPage: totalPage,
			currentPage: page,
			categoryList: categoryList,
			originals: query
		}
		res.render("./item/list.ejs", locals);
	}

}
