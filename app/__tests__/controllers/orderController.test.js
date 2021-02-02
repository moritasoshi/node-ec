const orderController = require("../../controllers/orderController"),
Order = require("../../models/order"),
OrderItem = require("../../models/orderItem"),
Item = require("../../models/item"),
mongoose = require("mongoose");
const order = require("../../models/order");
//user = require("../../models/user")



describe ('controller', () => {
  const req = {
    user: {
      addresses: [
        '600fde005f18dc813068ec45',
        '600fe145494da3b9ec5444f7',
        '600fe16b494da3b9ec5444f8',
        '600fe1b7494da3b9ec5444f9'
      ],
      _id: '600fddc65f18dc813068ec44',
      firstName: 'えとう',
      lastName: 'こうへい',
      email: 's@gmail.com',
      password: '$2b$10$erVIEtiKa9G6aiPvUHw2mu0UKNrVQub/ZwhiDgfvkDOKkenebIOmO',
      createdAt: '2021-01-26T09:15:50.666Z',
      updatedAt: '2021-01-26T14:23:11.405Z',
      defaultAddress: '600fe145494da3b9ec5444f7'
    },
    body: {itemQuantity: 1,
           orderItemId: 1}
    

  };

  const res = {
    render: jest.fn()
  }

  const next = jest.fn();

  //DB接続
  beforeAll(async () => {
    await mongoose
    .connect('mongodb://localhost/nodec_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
  });
  //DB切断
  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach( () => {
    Item.deleteMany({});
		OrderItem.deleteMany({});
		Order.deleteMany({});
		res.render.mockClear();
		next.mockClear();
  });

  describe('indexのテスト', () => {
    test('view正常系', async () => {
      //orderなし
      const order = [];

      await Order.insertMany(order);
      await orderController.index(req, res);
 
      expect(res.render).toHaveBeenCalledWith('./order/cart.ejs', {
        total: [],
      });
    });
  })

  describe('indexのテスト', () => {
    test('db正常系', async () => {
      const order = [
        {
          orderItems: '600fddc65f18dc813068ec44',
          user: '600fddc65f18dc813068ec44',
          paymentMethod: 0,
          status: 0,
          subTotal: 7040,
        }
      ]
      await Order.insertMany(order);
      
      const findOrder = await Order.findOne({ status: 0 }, function(err, result) {
        if (err) throw err;
        return result;
      })
      //expect(findOrder["orderItems"]).toEqual(['600fddc65f18dc813068ec44']);
      //expect(//findOrder["user"]).toBe('600fddc65f18dc813068ec44');
      expect(findOrder["paymentMethod"]).toEqual(0);
      expect(findOrder["status"]).toEqual(0);
      expect(findOrder["subTotal"]).toEqual(7040);
    })
  })

  describe('indexのテスト2', () => {
    test('view正常系', async () => {
      //orderあり
      const item = [
        {
          name: 'Node.js超入門[第3版]',
          price: 3520,
          releaseDate: '2020/07/20',
          category: 'コンピュータ/IT',
          description: 'Webアプリ開発に使える言語はたくさんありますが、ビギナーが選ぶべき言語はなんといってもJavascriptです。そして、Node.jsというソフトを使うと、Javascriptでサーバーの開発もできるんです！',
          photoURL: '2.jpg'
        }
      ]

      await Item.insertMany(item);
      const itemResult = await Item.findOne({}, function(err, result){
        if (err) throw err;
        return result;
      })
      
      const orderItem = [
        {
          //_id: 6013c5dd34edae18d8313cda,
          item: {
            _id: itemResult._id,
            name: 'Node.js超入門[第3版]',
            price: 3520,
            releaseDate: '2020/07/20',
            category: 'コンピュータ/IT',
            description: 'Webアプリ開発に使える言語はたくさんありますが、ビギナーが選ぶべき言語はなんといってもJavascriptです。そして、Node.jsというソフトを使うと、Javascriptでサーバーの開発もできるんです！',
            photoURL: '2.jpg'
          },
          quantity: 2,
        }
      ]

      await OrderItem.insertMany(orderItem);
      
      const orderItemResult = await OrderItem.findOne({}, function(err, result){
          if (err) throw err;
          return result;
          
        })

      const order = [
            {
              orderItems: [ orderItemResult._id ],
              user: '600fddc65f18dc813068ec44',
              paymentMethod: 0,
              status: 0,
              subTotal: 7040,
            }
      ]
      
      await Order.insertMany(order);
      const orderResult = await Order.findOne({}, function(err, result) {
        if (err) throw err;
        return result;
      })

      //console.log(orderResult);
      //console.log('kkkkkkkkkk');
       
      
       const total = order.subTotal
       
       
       //await orderController.index(req, res);
       //console.log(res.render);
       //console.log('kkkk');
       //expect(res.render).toHaveBeenCalled();
       /* expect(res.render).toHaveBeenCalledWith('./order/cart.ejs', {
          orderItemResult: orderItemResult,
          total: total, 
          user: req.user}); */
    })
  })

  describe('indexのテスト2', () => {
    test('db正常系', async () => {
      const item = [
        {
          name: 'Node.js超入門[第3版]',
          price: 3520,
          releaseDate: '2020/07/20',
          category: 'コンピュータ/IT',
          description: 'Webアプリ開発に使える言語はたくさんありますが、ビギナーが選ぶべき言語はなんといってもJavascriptです。そして、Node.jsというソフトを使うと、Javascriptでサーバーの開発もできるんです！',
          photoURL: '2.jpg'
        }
      ]

      await Item.insertMany(item);

      const itemResult = await Item.findOne({}, function(err, result){
        if (err) throw err;
        return result;
      })

      const orderItem = [
        {
          //_id: 6013c5dd34edae18d8313cda,
          item: {
            _id: itemResult._id,
            name: 'Node.js超入門[第3版]',
            price: 3520,
            releaseDate: '2020/07/20',
            category: 'コンピュータ/IT',
            description: 'Webアプリ開発に使える言語はたくさんありますが、ビギナーが選ぶべき言語はなんといってもJavascriptです。そして、Node.jsというソフトを使うと、Javascriptでサーバーの開発もできるんです！',
            photoURL: '2.jpg'
          },
          quantity: 2,
        }
      ]

      await OrderItem.insertMany(orderItem);

      const orderItemResult = await OrderItem.findOne({}, function(err, result){
        if (err) throw err;
        return result;
      })

      const order = [
        {
          orderItems: [ orderItemResult._id ],
          user: '600fddc65f18dc813068ec44',
          paymentMethod: 0,
          status: 0,
          subTotal: 7040,
        }
      ]

      await Order.insertMany(order);

      const findOrder = await Order.findOne({}, function(err, result){
        if (err) throw err;
        return result;
      })

     console.log(findOrder);

     
      await OrderItem.find({ _id: orderItemResult["_id"] })
        .populate("item")
        .exec(function(err, result) {
          if (err) throw err;
          console.log(result);      
      

      expect(result[0]._id).toEqual(orderItemResult["_id"]);
      expect(result[0].quantity).toEqual(2);
      expect(result[0].item.name).toEqual('Node.js超入門[第3版]');
      expect(result[0].item.price).toEqual(3520);
      expect(result[0].item.releaseDate).toEqual('2020/07/20');
      expect(result[0].item.category).toEqual('コンピュータ/IT');
      expect(result[0].item.description).toEqual('Webアプリ開発に使える言語はたくさんありますが、ビギナーが選ぶべき言語はなんといってもJavascriptです。そして、Node.jsというソフトを使うと、Javascriptでサーバーの開発もできるんです！');
      expect(result[0].item.photoURL).toEqual('2.jpg');

      
    })
    })
  })

  describe('changeのテスト1', () => {
    test('view正常系', async () => {
      //削除
      req.body.itemQuantity = '';
      const item = [
        {
          name: 'Node.js超入門[第3版]',
          price: 3520,
          releaseDate: '2020/07/20',
          category: 'コンピュータ/IT',
          description: 'Webアプリ開発に使える言語はたくさんありますが、ビギナーが選ぶべき言語はなんといってもJavascriptです。そして、Node.jsというソフトを使うと、Javascriptでサーバーの開発もできるんです！',
          photoURL: '2.jpg'
        }
      ]

      await Item.insertMany(item);
      const itemResult = await Item.findOne({}, function(err, result){
        if (err) throw err;
        //console.log(result);

        return result;
      })

      const orderItem = [
        {
          //_id: 6013c5dd34edae18d8313cda,
          item: {
            _id: itemResult._id,
            name: 'Node.js超入門[第3版]',
            price: 3520,
            releaseDate: '2020/07/20',
            category: 'コンピュータ/IT',
            description: 'Webアプリ開発に使える言語はたくさんありますが、ビギナーが選ぶべき言語はなんといってもJavascriptです。そして、Node.jsというソフトを使うと、Javascriptでサーバーの開発もできるんです！',
            photoURL: '2.jpg'
          },
          quantity: 0,
        }
      ]
      
      await OrderItem.insertMany(orderItem);
      
      //req.body.itemQuantity = null;
      const orderItems = await OrderItem.findOne({}, 
        function(err, result) {
          if (err) throw err;
          return result;
        })
        //console.log(orderItems);
      req.body.orderItemId = orderItems._id;

      res.redirect = jest.fn();
      await orderController.change(req, res);
      //expect(res.render).toHaveBeenCalled();
      
      expect(res.redirect).toHaveBeenCalledWith('/order');
      
		
      
    })
  })


  describe('changeのテスト2', () => {
    test('view正常系', async () => {
    //数量変更
    req.body.itemQuantity = '2';

    const item = [
      {
        name: 'Node.js超入門[第3版]',
        price: 3520,
        releaseDate: '2020/07/20',
        category: 'コンピュータ/IT',
        description: 'Webアプリ開発に使える言語はたくさんありますが、ビギナーが選ぶべき言語はなんといってもJavascriptです。そして、Node.jsというソフトを使うと、Javascriptでサーバーの開発もできるんです！',
        photoURL: '2.jpg'
      }
    ]

    await Item.insertMany(item);
    const itemResult = await Item.findOne({}, function(err, result){
      if (err) throw err;
      //console.log(result);

      return result;
    })

    const orderItem = [
      {
        //_id: 6013c5dd34edae18d8313cda,
        item: {
          _id: itemResult._id,
          name: 'Node.js超入門[第3版]',
          price: 3520,
          releaseDate: '2020/07/20',
          category: 'コンピュータ/IT',
          description: 'Webアプリ開発に使える言語はたくさんありますが、ビギナーが選ぶべき言語はなんといってもJavascriptです。そして、Node.jsというソフトを使うと、Javascriptでサーバーの開発もできるんです！',
          photoURL: '2.jpg'
        },
        quantity: 2,
      }
    ]

    await OrderItem.insertMany(orderItem);
    const orderItems = await OrderItem.findOne({}, 
      function(err, result) {
        if (err) throw err;
        return result;
      })
    req.body.orderItemId = orderItems._id;
    

    
    res.redirect = jest.fn();
    await orderController.change(req, res);
    
    expect(res.redirect).toHaveBeenCalledWith('/order');


    })
  })


  /* describe('addのテスト', () => {
    test('view正常系', async () => {
    

    const orderItem = [
      {
        //_id: 6013c5dd34edae18d8313cda,
        item: {
          _id: '60011c2d19a23bdda3b07d76',
          name: 'Node.js超入門[第3版]',
          price: 3520,
          releaseDate: '2020/07/20',
          category: 'コンピュータ/IT',
          description: 'Webアプリ開発に使える言語はたくさんありますが、ビギナーが選ぶべき言語はなんといってもJavascriptです。そして、Node.jsというソフトを使うと、Javascriptでサーバーの開発もできるんです！',
          photoURL: '2.jpg'
        },
        quantity: 2,
      }
    ]

    await OrderItem.insertMany(orderItem);

    const orderItemResult = await OrderItem.findOne({}, function(err, result){
      if (err) throw err;
      return result;})

    const order = [
        {
          orderItems: [ orderItemResult._id ],
          user: '600fddc65f18dc813068ec44',
          paymentMethod: 0,
          status: 0,
          subTotal: 7040,
        }
    ]
    await Order.insertMany(order);
    //await orderController.change(req, res);
    res.redirect = jest.fn();
    //expect(res.redirect).toHaveBeenCalledWith('./order');


    })
  }) */




})