"use strict";

const Order = require("../models/order"),
	OrderItem = require("../models/orderItem"),
	Item = require("../models/item"),
	User = require("../models/user"),
	Address = require("../models/address"),
	user = require("../models/user"),
	getOrderItemParams = body => {
		return {
			item: body._id,
			quantity: body.quantity,
		}
	}
// { body } = require("express-validator");

module.exports = {

   //カート中身画面表示
   
	 index: async(req, res) => {
    
     var cart;
     
     //カートなし
     const order = await Order.find({}, function(err, orderResult) {
       if (err) throw err;
       return orderResult;
    });


      //カートなし
      if (!order) {
        cart = 1;   
      }
        
      //カートあり
      if (order) {
        cart = 2;
      }
    
     //カートなし
     if (cart != 2) {
        res.render('./cart.ejs', {
          noCart: 'カートに商品がありません',
          cartIn: '',
          body: [],
        });
      }
      
      //カート商品あり
      if (cart = 2) {
        //orderを取得
        const newOrder = await Order.findOne({}, function(err, result) {
          if (err) throw err;
          return result;
        });
        
        //orderItemの数だけorderItemとitemをjoinして取得  
        OrderItem.find({_id : newOrder.orderItems})
          .populate("item")
          .exec(function(err, orderItemResult) {
            if (err) throw err;           
            var orderItemLists = orderItemResult;
              
            res.render('./cart.ejs',{
              cartIn: '',
              noCart: '',
              body : orderItemLists,
            });   
          });
      }
},

  //カート削除
  delete: (req, res) => {
     
  },
  

	//カートに商品追加
	add: async (req, res) => {
		const loginUser = req.user;
		const newOrderItem = getOrderItemParams(req.body);

		// カートがすでに存在するか判定
		let order = await Order.findOne({user: loginUser._id})
			.populate("orderItems")
			.exec()
			.then(data => {
				return data;
			})
			.catch(err => {
				console.error(err);
				throw err;
			});

		if (!order) { // カートなしの場合は新規作成
			const newOrder = new Order({
				user: loginUser._id,
				paymentMethod: 0,
				status: 0,
			});
			order = await Order.create(newOrder)
				.then(data => {
					return data;
				})
				.catch(err => {
					console.error(err);
					throw err;
				});
		} else {
			// 同じ商品がある場合は数量のみ更新
			const orderItemWithTheSameItem = order["orderItems"]
				.filter(v => v.item.toString() === newOrderItem.item.toString())

			if (orderItemWithTheSameItem.length > 0) {
				await OrderItem.findByIdAndUpdate(orderItemWithTheSameItem[0]["_id"],
					{$inc: {quantity: newOrderItem.quantity}},
					{new: true})
					.then(data => {
					})
					.catch(err => {
						console.error(err);
						throw err;
					});
				return res.send("success : only quantity is updated");
			}
		}

		// orderItemの新規作成
		const orderItem = await OrderItem.create(newOrderItem)
			.then(data => {
				return data;
			})
			.catch(err => {
				console.error(err);
				throw err;
			});

		// カートにリレーション追加
		await Order.findByIdAndUpdate(order._id, {
			$push: {orderItems: orderItem._id}
		}).catch(err => {
			console.error(err);
			throw err;
		})
		res.send("success");
	},

}