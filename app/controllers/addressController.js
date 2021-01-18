"use strict";

const Address = require("../models/address"),
	User = require("../models/user"),
	{validationResult} = require('express-validator'),
	getAddressParams = body => {
		return {
			_id: body._id,
			firstName: body.firstName,
			lastName: body.lastName,
			telephone: body.telephone,
			zipCode: body.zipCode,
			address: body.address,
		};
	},
	getIsDefault = body => {
		if (body.isDefault === "1") return true;
		return false;
	}

module.exports = {
	show: (req, res) => {
		const loginUser = req.session.passport.user;
		User.findOne({_id: loginUser._id})
			.populate("address")
			.populate("defaultAddress")
			.exec()
			.then(data => {
				res.render('./address/show.ejs', {address: data.address, defaultAddress: data.defaultAddress});
			})
			.catch(err => {
				console.error(err)
			})
	},
	toRegister: (req, res) => {
		const locals = {
			actionURL: "/account/address/register",
			btnText: "住所を追加"
		}
		res.render('./address/register.ejs', locals);
	},
	register: (req, res, next) => {
		const newAddress = new Address(getAddressParams(req.body));
		const loginUser = req.session.passport.user;
		const locals = {
			errors: validationResult(req).errors,
			original: req.body,
			actionURL: "/account/address/register",
			btnText: "住所を追加"
		}
		if (locals.errors.length !== 0) { // バリデーション失敗
			return res.render('./address/register.ejs', locals);
		}

		newAddress.save()
			.then((address) => {
				User.updateOne( // addressesへの追加
					{_id: loginUser._id},
					{$push: {address: address._id}},
					function (err) {
						if (err) throw err;
					}
				);
				if (getIsDefault(req.body)) {
					User.updateOne( // defaultAddressの変更
						{_id: loginUser._id},
						{$set: {defaultAddress: address._id}},
						function (err) {
							if (err) throw err;
						}
					);
				}
				next()
			})
			.catch(err => {
				console.error(err);
				locals.errors.push({
					msg: 'DBエラー',
					param: 'firstName',
				})
				return res.render('./address/register.ejs', locals);
			})
	},
	toEdit: (req, res) => {
		const addressId = req.params._id;
		const loginUser = req.session.passport.user;

		Address.findOne({_id: addressId})
			.then(data => {
				var locals = {
					original: data,
					actionURL: "/account/address/edit",
					btnText: "住所を更新",
					isDefault: "0"
				}
				User.findOne({_id: loginUser._id}) // デフォルトの住所を確認
					.populate("defaultAddress")
					.exec()
					.then(data => {
						if (data.defaultAddress._id.toString() === addressId) {
							locals.isDefault = "1";
						}
						res.render('./address/register.ejs', locals);
					})
			})
			.catch(err => {
				console.error(err);
				throw err;
			})
	},
	edit: (req, res, next) => {
		const address = getAddressParams(req.body);
		const loginUser = req.session.passport.user;

		const locals = {
			errors: validationResult(req).errors,
			original: address,
			actionURL: "/account/address/edit",
			btnText: "住所を更新"
		}
		if (!address._id) {
			locals.errors.push({
				msg: '不正なリクエストです。',
				param: 'firstName',
				location: 'db'
			})
		}
		if (locals.errors.length !== 0) { // バリデーション失敗
			return res.render('./address/register.ejs', locals);
		}

		// ドキュメント更新
		Address
			.findByIdAndUpdate(address._id, address)
			.then((address) => {
				// defaultAddressの変更
				if (getIsDefault(req.body)) {
					User.findByIdAndUpdate(loginUser._id, {$set: {defaultAddress: address._id}})
						.catch(err => {
							throw err
						})
				}
				next();
			})
			.catch(err => {
				console.error(err);
				locals.errors.push({
					msg: 'DBエラー',
					param: 'firstName',
				})
				return res.render('./address/register.ejs', locals);
			})

	}
}
