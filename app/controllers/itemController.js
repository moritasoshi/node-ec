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
	};


<<<<<<< HEAD
    Item.find({_id: "60011c2e19a23bdda3b07d7c"}, function(err, result) {
      if (err) throw err;
      console.log(result[0]._id);
      res.render('./detail.ejs', {
        _id: result[0]._id,
        name: result[0].name,
        price: result[0].price,
        photoURL: result[0].photoURL,
        description: result[0].description,
      });
      
      
    });
=======
module.exports = {
	show: (req, res) => {
		Item.find({_id: "60011c2e19a23bdda3b07d7c"}, function (err, result) {
			if (err) throw err;
>>>>>>> d3124351446df028059a8cf4b8b49ff9c830fb86

			res.render('./detail.ejs', {
				name: result[0].name,
				price: result[0].price,
				photoURL: result[0].photoURL,
				description: result[0].description,
			});
		});
	},
	itemList: async (req, res) => {
		const itemList = await Item.find({}, (err, data) => {
			if (err) throw err;
			return data;
		});
		const locals = {
			itemList: itemList
		}
		res.render("./item/list.ejs", locals);
	}

}
