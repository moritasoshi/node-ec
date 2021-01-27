"use strict";

const { body } = require("express-validator");
const { update } = require("../models/user");

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
        const newOrder = await Order.find({ status: 0 }, function(err, result) {
          if (err) throw err;
          return result;
        });
        //console.log(newOrder);
        if (newOrder) {
          //orderItemの数だけorderItemとitemをjoinして取得  
        await OrderItem.find({ _id: newOrder[0].orderItems })
        .populate("item")
        .exec(function(err, orderItemResult) {
          if (err) throw err;           
          //return orderItemResult;
          //金額算出
          var total = 0;
          //console.log(orderItemResult);
          orderItemResult.forEach(orderItem => {
            //console.log('kkkkkkkk');
            //console.log(orderItem);
            var nowTotal;
            nowTotal = orderItem.quantity * orderItem.item.price;
            total = total + nowTotal;
          });
          //orderのsubtotalを更新
          /* Order.findByIdAndUpdate(newOrder[0]._id,{
            $set: { subTotal: total } 
          }).catch(err => {
            console.error(err);
            throw err;
          }) */
          //console.log(req.user);
          //var user = req.user;
          //console.log(user);
          Order.findByIdAndUpdate(newOrder[0]._id, {
              $set: {subTotal: total} },
            function() {
              if (err) throw err; 
            })
            res.render('./cart.ejs',{
            orderItemResult : orderItemResult,
            total : total,
            user: req.user,
          });   
        });

        } else if (!newOrder) {
          res.render('./cart.ejs',{
            //orderItemResult : orderItemResult,
            total : [],
            //user: req.user,
          });   
        }
        
      
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
      //orderのorderItems[]１つ削除(新たなorderに更新)
      //var afterDeleteOrderItems;
      
      ////////////////////////////////////////////////////
      /* preOrder[0].orderItems.forEach((orderItemId, index) => {
        if (orderItemId.toString() === preOrderItem._id.toString()) {
          preOrder[0].orderItems.splice(index, 1);
        }
      }); */
      //console.log(preOrder[0].orderItems);
      //console.log(preOrderItem._id);
      const afterDeleteOrderItems = preOrder[0].orderItems
        .filter(v => v.toString() != preOrderItem._id.toString())
      //afterDeleteOrderItems = preOrder[0].orderItems;

      //console.log(afterDeleteOrderItems);
      //console.log(afterDeleteOrderItems[0]);
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
		let order = await Order.findOne({ status: 0 },{user: loginUser._id})
			.populate("orderItems")
			.exec()
			.then(data => {
				return data;
			})
			.catch(err => {
				console.error(err);
				throw err;
      });
      
    //console.log('llllll');
    //console.log(req.user);
		if (!order) { // カートなしの場合は新規作成
			const newOrder = new Order({
				user: loginUser._id,
				paymentMethod: 0,
        status: 0,
        subTotal: 0,
        //destinationAddress: '',
        //tax: 0,
        //total: 0,
        //orderDate: Date.now(),
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
    //orderを指定して取得
    //onsole.log(req.user);
    //console.log('kkkkkkk');
    await Order.find({ user: req.user._id },
                     { status: 0 })
      .populate("user")
      .exec(function(err, orderResult) {
        if (err) throw err;
        //orderItem、itemを取得
        OrderItem.find({ _id: orderResult[0].orderItems })
          .populate("item")
          .exec(function(err, orderItemResult) {
            if (err) throw err;
            //console.log(orderItemResult);
            //商品合計金額算出
            var total;
            var tax;
            total = Math.floor(orderResult[0].subTotal * 1.1);
            tax = Math.floor(orderResult[0].subTotal * 0.1);
            //Addressのリストを取得
            Address.find({ _id: orderResult[0].user.addresses })
              .populate("addresses")
              .exec(function(err, addressResult) {
                if (err) throw err;
                //console.log(addressResult[0].defaultAddress);

                console.log(orderResult[0].subTotal);
                console.log(total);
                console.log(tax);
                
                

                res.render("./orderConfirm.ejs", {
                  orderItemResult: orderItemResult,
                  user: orderResult[0].user,
                  subTotal: orderResult[0].subTotal,
                  tax: tax,
                  total: total,
                  address: addressResult,
                  defaultAddress: orderResult[0].user.defaultAddress,
                  //addressList: orderResult[0].user.addresses,

              })
            
            });
          })
        
      })
    
    
  },

  //注文確定する
  determine: async (req, res) => {

    //orderを指定して取得
    const determineOrder = Order.find({ user: req.user._id },
               { status: 0 },
               function(err, result) {
                if (err) throw err;
                
               
              
    //orderを更新
    Order.findByIdAndUpdate(result[0]._id,
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

    res.render("./orderFinished.ejs", {    
    })
  })
  },
}