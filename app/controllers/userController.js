"use strict";

const User = require("../models/user"),
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
		newUser.save(function (err) {
			if (err) throw err;
		});
		next();
	},
	toLogin: (req, res) => {
		res.render("./account/login.ejs");
	},
	logout: (req, res) => {
		req.session.passport.user = undefined;
		res.redirect('/');
	}
}
