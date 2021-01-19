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
   
	 index: (req, res) => {
    
     var order;
     var orderResult;
     
     Order.findOne({}, function(err, orderResult) {
       //console.log(result.length == []);
       if (err) throw err;
       //var orderResult;
       //console.log(orderResult1);
       //orderResult11 = orderResult1;
       //orderResult = 111;
       //console.log(orderResult);
       //カートなし
       if (orderResult == []) {
        order = 1;
      }
      //カートあり、1種類
      if (orderResult.orderItems.length == 1) {
        order = 2;
      }
      //カートあり、2種類以上
      if (orderResult.orderItems.length > 2) {
        order = 3;
      }




      //console.log(orderResult);  
     });
     //var orderResult11;
     //console.log(orderResult11);
     //console.log('ooo');
     
    
     //カートなし
     if (order = 1) {
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
      if (order = 2 || 3) {
        var orderResult1;
        k;
        Order.findOne({}, function(err, result) {
          //var orderResult1;
          orderResult1 = result;
          //console.log(result);
          k=3;
          
        });
        console.log(k);
        //console.log(orderResult1);
        
        var orderItemsList = [];
        //console.log(orderResult[0]);
        orderResult.orderItems.forEach(itemId => {
          OrderItem.find({_id : itemId})
            .populate('type item.Item')
            .exec(function(err, orderItemresult) {
              if (err) throw err;
              orderItemsList = orderItemresult;
            }); 
          });
        
        
      }
     
      
      res.render('./cart.ejs',{
        //var body = [],
        body : orderItemsList,
       
      });
    

    
  },
  
  //カートに商品追加
  add: (req, res) => {

    //商品詳細IDから商品を取得
    var newItem = new Item();
    Item.find({ _id: req.body._id }, function(err, result) {
      if (err) throw err;
      newItem = result;
      //console.log(newItem);
    });
    //カートが存在するか
    //orderレコードの有無
    var order;
    Order.find({}, function(err, orderResult) {
      if (err) throw err;
      if (orderResult.length == []) {
        order = 1;
      } 
      if (orderResult.length != []) {
        order = 2;
      }
      console.log(orderResult);
      //console.log(order);
    });
    
      
      //カートが空
      if (order = 1) {
        //console.log('ok');
        
        //新規にカート作成
        //orderItemを作成
        var newOrderItem = new OrderItem({
          item: newItem._id,
          quantity: 1, 
        });
        //console.log(newOrderItem);
        //orderItemを保存・取得
        newOrderItem.save((err) => {
          if (err) throw err;
        });
        var orderItemId;
        OrderItem.find({},(err, orderItemresult) => {
          if (err) throw err;
          //console.log(orderItemresult[0]._id);
          orderItemId = orderItemresult[0]._id;
          //console.log(orderItemId);
        });
        //商品金額算出用の関数が必要
        //orderを作成

        var user = new User({
          firstName: req.firstName,
          lastName: req.lastName,
          email: req.password,
          address: req.defaultAddress,        
        });

        var destinationAddress = new Address({
          name: '1',
        });

        var orderItems = new OrderItem({
        });

        var newOrder = new Order({
          //user: [],
          orderItems: {orderItemId},
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
        //カートに同じ商品が存在するか
        var newItem = new Item(getItemParams(req.body));
        OrderItem.find ({item: newItem._id},(err, orderItemresult) => {
          if(orderItemresult != null){
            //orderItemを更新
            OrderItem.update(
              { quantity: orderItemresult[0].quantity},
              { $set: { quantity:  orderItemresult[0].quantity+1 } },
              function (err) {
                if (err) throw err;
              }
            );
            
              
            } else {
            //orderItemを新規作成  
            var newOrderItem = new OrderItem ({
              item: newItem._id,
              quantity: 1,
            });
            newOrderItem.save((err) => {
              if (err) throw err;
            });

          }


        });
        

      }
    
    
    res.render('./cart.ejs', {
      //body: req.body,
      body: [],
      noCart: '',
      cartIn: 'カートに追加',
    });
    
  },
}