"use strict";

const {body} = require("express-validator");
const {update} = require("../models/user");

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

      //orderを取得
      await Order.findOne({ status: 0 }).and({ user: req.user._id })
              .exec(function(err, resultOrder) {
              if (err) throw err;
    
      //orderなし
      if (!resultOrder) {
          res.render('./order/cart.ejs',{
            total : [],
          });   
      }

      //orderあり
      if (resultOrder) {
        //orderItemの数だけorderItemとitemをjoinして取得  
        OrderItem.find({ _id: resultOrder.orderItems })
          .populate("item")
          .exec(function(err, orderItemResult) {
          if (err) throw err;       
          //小計金額算出
          var total = 0;
          orderItemResult.forEach(orderItem => {
            var nowTotal;
            nowTotal = orderItem.quantity * orderItem.item.price;
            total = total + nowTotal;
          });
  
            //orderのsubtotalを更新
            Order.findByIdAndUpdate(resultOrder._id, { subTotal: total },
              function() {
                if (err) throw err; 
              })
            res.render('./order/cart.ejs',{
            orderItemResult : orderItemResult,
            total : total,
            user: req.user,
            })   
          })
        }   
      })

　},

  //カート数量変更
  change: async(req, res) => {

    //更新・削除前のorderItemを取得
    const preOrderItem = await OrderItem.findById(
      req.body.orderItemId,
      function (err, result) {
        if (err) throw err;
        return result;
      }
    )
    
    //削除
    if (req.body.itemQuantity == null) {
      //orderItemを削除
      OrderItem.remove({ _id: req.body.orderItemId }, 
        function(err) {
          if (err) throw err;
        })

      //更新前のorderを取得
      const preOrder = await Order.find({},
        function (err, result) {
          if (err) throw err;
          return result;
        })

      const afterDeleteOrderItems = preOrder[0].orderItems
        .filter(v => v.toString() != preOrderItem._id.toString())
      
      Order.update(
        { _id: preOrder[0]._id },
        { $set: { orderItems: afterDeleteOrderItems } },
        function (err) {
          if (err) throw err;
        }
      )
        res.redirect('/order');
    }


    //数量変更
    if (req.body.itemQuantity != null) {

      //orderItemを更新
      await OrderItem.update(
        { _id: preOrderItem._id },
        { $set: { quantity: req.body.itemQuantity } },
        function(err) {
          if (err) throw err;
        }
      )
      res.redirect('/order'); 
    }
  },

	//カートに商品追加
	add: async (req, res) => {

		const loginUser = req.user;
		const newOrderItem = getOrderItemParams(req.body);


		// カートがすでに存在するか判定

    let order = await Order.findOne({ status: 0 }).and({user: loginUser._id})
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
				subTotal: 0,
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
				return res.redirect("/order");
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
		res.redirect("/order");

  },
  
  //注文確認画面表示
  confirm: async (req, res) => {

     //orderを取得
     Order.findOne({ status: 0 }).and({ user: req.user._id })
      .populate("user")
      .populate("orderItems")
      .exec(function(err, orderResult) {
        if (err) throw err;

        //orderItem、itemを取得
        OrderItem.find({ _id: orderResult["orderItems"] })
          .populate("item")
          .exec(function(err, orderItemResult) {
            if (err) throw err;
            //商品合計金額算出
            var total;
            var tax;
            total = Math.floor(orderResult.subTotal * 1.1);
            tax = Math.floor(orderResult.subTotal * 0.1);

            //Addressのリストを取得
            Address.find({ _id: orderResult.user.addresses })
              .populate("addresses")
              .exec(function(err, addressResult) {
                if (err) throw err;

                res.render("./order/orderConfirm.ejs", {
                  orderItemResult: orderItemResult,
                  user: orderResult.user,
                  subTotal: orderResult.subTotal,
                  tax: tax,
                  total: total,
                  address: addressResult,
                  defaultAddress: orderResult.user.defaultAddress,

                })
              })
          })
      }) 
  },

  //注文確定する
  determine: async (req, res) => {

    const address = await Address.find({ user: req.user._id })
      .exec(function(err, result) {
        if (err) throw err;
        
    if (!result) {
      //
    } else {
      //orderを指定して取得
      const newOrder =  Order.findOne({ status: 0 }).and({ user: req.user._id })
       .exec(function(err, resultOrder) {
       if (err) throw err;
     
        //orderを更新
        Order.findByIdAndUpdate(resultOrder._id,
          { $set: { subTotal: req.body.subTotal,
                    tax: req.body.tax,
                    total: req.body.total,
                    orderDate: new Date(),
                    destinationAddress: req.body.address,
                    paymentMethod: req.body.pay,
                    status: 1,
          }},
        function(err) {
           if (err) throw err;
        })
        res.render("./order/orderFinished.ejs")
      })
    }
    })
  },

}