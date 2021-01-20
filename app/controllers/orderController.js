"use strict";

var Order = require("../models/order");
var OrderItem = require("../models/orderItem");
var Item = require("../models/item");
var User = require("../models/user");
var Address = require("../models/address");
const { Schema } = require("mongoose");
const user = require("../models/user");

//const { body } = require("express-validator");


	getOrderParams : body => {
		return {
			user: body.user,
			orderItems: body.orderItems,
			subTotal: body.subTotal,
			tax: body.tax,
      total: body.total,
      orderDate: body.orderDate,
      destinationAddress: body.destinationAddress,
      paymentMethod: body.paymentMethod,
      status: body.status,
		};
  };

  getItemParams : body => {
		return {
      _id: body._id,
			name: body.name,
			price: body.price,
			releaseDate: body.releaseDate,
			category: body.category,
      description: body.description,
      photoURL: body.photoURL,
		};
  };
  
  

module.exports = {
  //カート中身画面表示
   
	 index: async(req, res) => {
    
     var cart;
     //var orderResult;
     //カートなし
     const order = Order.find({}, function(err, orderResult) {
       //console.log(result.length == []);
       if (err) throw err;
       return orderResult;
       //var orderResult;
       //console.log(orderResult1);
       //orderResult11 = orderResult1;
       //orderResult = 111;
       //console.log(orderResult);
      //order = 3;

     });

     //console.log(order);

      if (order) {
        //console.log(order);
        cart = 1;
        //console.log('00000000000000');
      }
      //カートあり、1種類
      if (!order) {
        //console.log(order);
        cart = 2;
        //console.log('00000000000000');
      }
      //カートあり、2種類以上
      /* if (orderResult[0].orderItems.length > 2) {
        order = 3;
      } */
    
      //console.log(order);
      //console.log('00000000000000');
      //console.log(cart);

     //var orderResult11;
     //console.log(orderResult11);
     
     
    
     //カートなし
     if (cart = 1) {
        //console.log('ok');
        res.render('./cart.ejs', {
          noCart: 'カートに商品がありません',
          cartIn: '',
          body: [],
        });
     }

     //カート商品1以上
     /* if (order = 2) {
        
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
          res.render('./cart.ejs',{
            //var body = [],
            body : orderItemsList,
           
          });
          
      } */ 
      
      //カート商品2種類以上
      if (cart = 2) {
        //orderを取得
        const newOrder = await Order.findOne({}, function(err, result) {
          if (err) throw err;
          return result;
        });

        //orderItemの数だけorderItemとitemをjoinして取得
        var orderItemLists;
        newOrder.orderItems.forEach(orderItemId => {
          const orderItem = OrderItem.find({_id : orderItemId})
            .populate('type item.Item')
            .exec(function(err, orderItemResult) {
              if (err) throw err;
              //orderItemLists = orderItemResult;
              return orderItemResult;
            });
          orderItemLists = orderItem; 
          });
        
        
      }
     
      
      res.render('./cart.ejs',{
        //var body = [],
        body : orderItemsList,
       
      });
    

    
  },
  
  //カートに商品追加
  add: async (req, res) => {

    //商品詳細IDから商品を取得
    //var newItem = new Item();
    const detailItem = await Item.find({ _id: req.body._id }, function(err, result) {
      if (err) throw err;
      return result;
      //newItem = result;
      //console.log(newItem);
    });


    //カートが存在するか
    //orderレコードの有無
    var order;
    const or = Order.find({}, function(err, orderResult) {
      if (err) throw err;
      return orderResult; 
    });

    if (or.length == []) {
      order = 1;
    } 
    if (or.length != []) {
      order = 2;
    }
    
    
    
    
    
    //console.log(order);
    //console.log('kkkkkkkkkk');
    
      
      //カートが空
      if (order = 1) {
        //console.log('okkkkkkkkkkkkkkkkkkkkkkk');
        
        //新規にカート作成
        //orderItemを作成
        var newOrderItem = new OrderItem({
          item: detailItem._id,
          quantity: 1, 
        });
        console.log(newOrderItem);
        //orderItemを保存・取得
        newOrderItem.save((err) => {
          if (err) throw err;
          
        });
        //console.log('gggggggggggggggggggggggggggggggggggggggggggg');
        //////////////////////////////ここまでは処理通る///////////////////////////
        var orderItemId;
        const s = OrderItem.find({},(err, orderItemresult) => {
          if (err) throw err;
          return orderItemresult;
          //orderItemId = orderItemresult[0]._id;
          //console.log(orderItemId);
        });
        //console.log(s);
        //orderItemId = s._id;
        //console.log('kkkkkkk');
        //console.log(s[0]._id);
        //console.log('kkkkkkk');

        ////////////////////orderItemIdが取得できない//////////////////////////////////


        //商品金額算出用の関数が必要
        //orderを作成

        /* var user = new User({
          firstName: req.firstName,
          lastName: req.lastName,
          email: req.password,
          address: req.defaultAddress,        
        });

        var destinationAddress = new Address({
          name: '1',
        });

        var orderItems = new OrderItem({
        }); */

        var newOrder = new Order({
          //user: [],
          orderItems: [{orderItemId}],
          subtotal:1,
          tax:1,
          total:1,
          orderDate: new Date().toLocaleString(),
          //destinationAddress: [],
          paymentMethod: 0,
          status: 0,
        }); 
        //orderを保存
        newOrder.save((err) => {
          if (err) throw err;
        });
      }
       //カートがある
         if (order = 2) {
        //カートに同じ商品が存在する
        //var newItem = new Item(getItemParams(req.body));
        const orr = OrderItem.find ({item: detailItem._id},(err, orderItemresult) => {
          if (err) throw err;
          return orderItemresult;
        });
          if(orr != null){
            //orderItemを更新
            OrderItem.update(
              { quantity: orderItemresult[0].quantity},
              { $set: { quantity:  orderItemresult[0].quantity+1 } },
              function (err) {
                if (err) throw err;
              }
            );
          }
            //カートに同じ商品が存在しない  
            if (orr == null) {
            //orderItemを新規作成  
            var newOrderItem = new OrderItem ({
              item: detailItem._id,
              quantity: 1,
            });
            //orderItemを保存・取得
            newOrderItem.save((err) => {
              if (err) throw err;
            });

            const a = OrderItem.find({ item:  detailItem._id }, function (err, result) {
              if (err) throw err;
              return result;
            });

            //orderのorderItemsに新たなorderItemを追加して更新
            
            or.update(
              { orderItems: or.orderItems },
              { $set: { orderItems:  or.orderItems.push(a) } },
              function(err) {
                if (err) throw err;
              }
            );

            }
      }
    
    
    res.render('./cart.ejs', {
      //body: req.body,
      body: [],
      noCart: '',
      cartIn: 'カートに追加',
    });
    
  },
}