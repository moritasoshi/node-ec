"use strict";

const Item = require("../models/item"),
	getItemParams = body => {
		return {
			name: body.name,
			price: body.price,
			releaseDate: body.releaseDate,
			category: body.category,
      description: body.description,
      photoURL: body.photoURL
		};
	};

module.exports = {
	show: (req, res) => {
    res.render('./detail.ejs');
	},

}
