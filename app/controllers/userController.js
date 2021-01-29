"use strict";

const User = require("../models/user"),
	Order = require("../models/order"),
	OrderItem = require("../models/orderItem"),
	passport = require("passport"),
	{validationResult} = require('express-validator'),
	bcrypt = require('bcrypt'),
	itemsPerPage = 3,
	getUserParams = body => {
		return {
			firstName: body.firstName,
			lastName: body.lastName,
			email: body.email,
			password: body.password,
			zipCode: body.zipCode
		};
	};

async function populateItem(orderItems) {
	let populated = [];
	for (let orderItem of orderItems) {
		const item = await OrderItem.findById(orderItem._id)
			.populate("item");
		populated.push(item);
	}
	return populated;
};

module.exports = {
	show: async (req, res) => {
		const loginUser = req.user;
		// アカウント情報取得
		let userInfo = await User.findById(loginUser._id, {password: 0})
			.populate("defaultAddress")
			.then(data => {
				return data;
			})
			.catch(err => {
				console.error(err);
				throw err;
			})

		// ページの処理
		const query = req.query;
		const total = await Order.find({user: loginUser._id, status: {$in: [1, 2, 9]}}).count();
		const totalPage = Math.ceil(total / itemsPerPage);
		let page = query.page;
		if (!page || page <= 0) {
			page = 1;
		} else if (page > totalPage) {
			page = totalPage;
		}
		page = parseInt(page)
		const skipCount = (page - 1) * itemsPerPage;


		// 注文履歴を取得
		let orders = await Order.find({user: loginUser._id, status: {$in: [1, 2, 9]}})
			.sort({orderDate: -1})
			.skip(skipCount)
			.limit(itemsPerPage)
			.populate("orderItems")
			.populate("destinationAddress")
			.then(data => {
				return data;
			})
			.catch(err => {
				console.error(err);
				throw err;
			});
		// itemをjoinした結果を取得
		if (orders) {
			for (const order of orders) {
				order.orderItems = await populateItem(order.orderItems);
			}
		}

		const locals = {
			userInfo: userInfo,
			orders: orders,
			totalPage: totalPage,
			currentPage: page,
		}
		console.log(JSON.stringify(orders, null, "\t"));
		res.render('./account/detail.ejs', locals);
	},
	toRegister: (req, res) => {
		res.render('./account/register.ejs');
	},
	register: async (req, res, next) => {
		const newUser = new User(getUserParams(req.body));
		newUser.password = bcrypt.hashSync(newUser.password, 10);
		const locals = {
			errors: validationResult(req).errors,
			original: req.body
		}
		if (locals.errors.length !== 0) { // バリデーション失敗
			return res.render('./account/register.ejs', locals);
		}

		await newUser.save().catch(err => {
			if (err.message.match("duplicate key") && err.message.match("email")) { // メールアドレス重複
				locals.errors.push({
					value: '',
					msg: '登録済みのメールアドレスです',
					param: 'email',
					location: 'db'
				})
				return res.render('./account/register.ejs', locals);
			}
		})
		next();
	},
	toLogin: (req, res) => {
		const flash = req.flash('error')
		const message = {
			message: flash
		}
		res.render("./account/login.ejs", message);
	},
	login: passport.authenticate('local', {
		failureRedirect: "/account/login",
		failureFlash: true,
		successRedirect: "/",
		session: true
	}),
	logout: (req, res) => {
		req.logout();
		res.redirect('/');
	}
}
