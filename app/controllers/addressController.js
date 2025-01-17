"use strict";

const Address = require("../models/address"),
	User = require("../models/user"),
	{validationResult} = require('express-validator'),
	getNewAddressParams = body => {
		return {
			firstName: body.firstName,
			lastName: body.lastName,
			telephone: body.telephone,
			zipCode: body.zipCode,
			address: body.address,
		};
	},
	getUpdateAddressParams = body => {
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
		const loginUser = req.user;
		User.findOne({_id: loginUser._id})
			.populate("addresses")
			.populate("defaultAddress")
			.exec()
			.then(user => {
				const addresses = user.addresses
					.filter((v) => v._id.toString() !== user.defaultAddress._id.toString());
				res.render('./address/show.ejs', {addresses: addresses, defaultAddress: user.defaultAddress});
			})
			.catch(err => {
				console.error(err)
				res.send({'error': 'An error has occurred - ' + err})
			})
	},
	toRegister: (req, res) => {
		const locals = {
			actionURL: "/account/address/register",
			btnText: "住所を追加"
		}
		res.render('./address/register.ejs', locals);
	},
	register: async (req, res) => {
		const newAddress = new Address(getNewAddressParams(req.body));
		let isDefault = getIsDefault(req.body);
		const locals = {
			errors: validationResult(req).errors,
			original: req.body,
			actionURL: "/account/address/register",
			btnText: "住所を追加"
		}
		if (locals.errors.length !== 0) { // バリデーション失敗
			return res.render('./address/register.ejs', locals);
		}

		const loginUser = await User.findById(req.user._id)
			.catch(err => console.error(err));

		if (!loginUser['defaultAddress']) isDefault = true; // 初回はデフォルトに設定

		// session取得
		const session = await Address.startSession()

		try {
			await session.startTransaction() // session開始

			const insertedAddress = await newAddress.save({session})
			await User.updateOne({_id: loginUser._id}, {$addToSet: {addresses: insertedAddress._id}}, {session})

			if (isDefault) {
				await User.updateOne({_id: loginUser._id}, {$set: {defaultAddress: insertedAddress._id}}, {session})
			}

			await session.commitTransaction() // commit
			console.log('--------commit-----------')

			res.redirect('/account/address');
		} catch (e) {

			await session.abortTransaction() // rollback
			console.log('--------abort-----------')
			console.error(e)

			locals.errors.push({
				msg: 'DBエラー',
				param: 'firstName',
			})
			res.render('./address/register.ejs', locals);
		}
	},
	toEdit: (req, res) => {
		const addressId = req.params._id;
		const loginUser = req.user;

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
	edit: async (req, res) => {
		const address = getUpdateAddressParams(req.body);
		const loginUser = req.user;
		let isDefault = getIsDefault(req.body);

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

		const latestUser = await User.findById(loginUser._id, function (err, data) {
			if (err) throw err;
			return data;
		})

		if (latestUser['addresses'].length === 1) isDefault = true; // 住所が1つの場合はデフォルトに設定

		// ドキュメント更新
		Address
			.findByIdAndUpdate(address._id, address)
			.then((address) => {
				// defaultAddressの変更
				if (getIsDefault(req.body)) {
					User.findByIdAndUpdate(loginUser._id, {$set: {defaultAddress: address._id}})
						.then(() => res.redirect('/account/address'))
						.catch(err => {
							throw err
						})
				}
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
	// 参照値を削除した後に、ドキュメントを削除
	// ※ドキュメントを先に削除すると、参照値の削除は不可能
	delete: (req, res) => {
		const loginUser = req.user;
		const addressId = req.params._id;
		// デフォルトの住所は削除不可
		User.findById(loginUser._id)
			.then(data => {
				if (data['defaultAddress'].toString() === addressId.toString()) {
					return res.send('デフォルトの住所は削除できません');
				}

				// Addressの削除
				User.updateMany({}, {$pull: {addresses: addressId}}, {multi: true})
					.then(() => Address.findByIdAndUpdate(addressId, {$set: {isDeleted: true}}))
					.catch(err => res.send({'error': 'An error has occurred - ' + err}))
					.finally(() => res.redirect('/account/address'));
			})
	},
}
