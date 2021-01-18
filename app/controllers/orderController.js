"use strict";

var Order = require("../models/order");
var OrderItem = require("../models/orderItem");
var Item = require("../models/item");
const { body } = require("express-validator");


	getOrderParams : body => {
		return {
			user: '1',
			orderItems: '1',
			subTotal: '1',
			tax: '1',
      total: '1',
      orderDate: '1',
      destinationAddress: '1',
      paymentMethod: '1',
      status: '1',
		};
  };
  
  

module.exports = {
  //カート内容画面
	 index: (req, res) => {
    
    Order.find({}, function(err, orderResult) {
      //console.log(result.length == []);
      if (err) throw err;

      //カート商品0種類
      if (orderResult.length == 0) {
        res.render('./cart.ejs', {
          noCart: 'カートに商品がありません',
          body: [],
        });

      //カート商品1種類
      } else if (orderResult.orderItems.length == 1) {
        
        OrderItem.find({_id : orderResult.orderItems})
          .populate('type item.Item')
          .exec(function(err, orderItemresult) {
            if (err) throw err;
            res.render('./cart.ejs',{
              //var body = [],
              body : orderItemresult,
              
              //photoURL: ItemResult.photoURL, 
              //name: ItemResult.name,
              //price: ItemResult.price,
              //totalPrice: orderResult.total,
            });
          });
            
            

        
      //カート商品2種類以上
      } else {
       
        var orderItemsList = [];
        
        orderResult.orderItems.forEach(itemId => {
          OrderItem.find({_id : itemId})
            .populate('type item.Item')
            .exec(function(err, orderItemresult) {
              if (err) throw err;
              orderItemsList = orderItemresult;
            }); 
          });
        
        res.render('./cart.ejs',{
          //var body = [],
          body : orderItemsList,
         
        });
      }
     
      
      
    });

    
	},

}
