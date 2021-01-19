"use strict";

const User = require("../models/user"),
	passport = require("passport"),
	{validationResult} = require('express-validator'),
	bcrypt = require('bcrypt'),
	getUserParams = body => {
		return {
			firstName: body.firstName,
			lastName: body.lastName,
			email: body.email,
			password: body.password,
			zipCode: body.zipCode
		};
	};

module.exports = {
	toRegister: (req, res) => {
		res.render('./account/register.ejs');
	},
	register: (req, res, next) => {
		const newUser = new User(getUserParams(req.body));
		newUser.password = bcrypt.hashSync(newUser.password, 10);
		const locals = {
			errors: validationResult(req).errors,
			original: req.body
		}
		if (locals.errors.length !== 0) { // バリデーション失敗
			return res.render('./account/register.ejs', locals);
		}

		const saveUser = new Promise((resolve, reject) => {
			newUser.save((err) => {
				if (err) reject(err);
				else resolve();
			})
		});

		saveUser
			.then(() => next())
			.catch(err => {
				if (err.message.match("duplicate key") && err.message.match("email")) { // メールアドレス重複
					console.log(locals.errors)
					locals.errors.push({
						value: '',
						msg: '登録済みのメールアドレスです',
						param: 'email',
						location: 'db'
					})
					return res.render('./account/register.ejs', locals);
				}
			})
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
