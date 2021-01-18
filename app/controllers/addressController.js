"use strict";

const Address = require("../models/address"),
	User = require("../models/user"),
	{validationResult} = require('express-validator'),
	getAddressParams = body => {
		return {
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
		res.render('./address/show.ejs');
	},
	toRegister: (req, res) => {
		res.render('./address/register.ejs');
	},
	register: (req, res, next) => {
		const newAddress = new Address(getAddressParams(req.body));
		const loginUser = req.session.passport.user;
		const locals = {
			errors: validationResult(req).errors,
			original: req.body
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
}
