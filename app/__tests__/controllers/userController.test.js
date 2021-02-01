const userController = require("../../controllers/userController"),
	User = require("../../models/user"),
	Address = require("../../models/address"),
	Item = require("../../models/item"),
	OrderItem = require("../../models/orderItem"),
	Order = require("../../models/order"),
	bcrypt = require('bcrypt'),
	mongoose = require("mongoose");

describe('controller', () => {
	const req = {};

	const res = {
		render: jest.fn()
	};

	const next = jest.fn();

	// DB接続
	beforeAll(async () => {
		await mongoose
			// .connect('mongodb://localhost:30001,localhost:30002,localhost:30003/nodec?replicaSet=rs0', {
			.connect('mongodb://localhost/nodec_test', {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useFindAndModify: false
			})
	});

	// DB切断
	afterAll(async () => {
		await mongoose.disconnect();
	});

	beforeEach(async () => {
		await User.deleteMany({});
		await Item.deleteMany({});
		await OrderItem.deleteMany({});
		await Order.deleteMany({});
		await Address.deleteMany({});
		res.render.mockClear();
		next.mockClear();
	});

	describe('toRegisterのテスト', () => {
		test('view/正常系', () => {
			userController.toRegister(req, res);
			expect(res.render).toHaveBeenCalledWith('./account/register.ejs');
			expect(res.render).toBeCalled();
		})
	});

	describe('toLoginのテスト', () => {
		test('view/正常系', () => {
			req.flash = jest.fn().mockReturnValue("test")
			const message = {
				message: "test"
			}
			userController.toLogin(req, res);
			expect(res.render).toHaveBeenCalledWith('./account/login.ejs', message);
		})
	});

	describe('logoutのテスト', () => {
		test('view/正常系', () => {
			res.redirect = jest.fn();
			req.logout = jest.fn()
			userController.logout(req, res);
			expect(res.redirect).toHaveBeenCalledWith('/');
		})
	});

	describe('registerのテスト', () => {
		test('view/正常系', async () => {
			req.body = {
				firstName: "foo",
				lastName: "bar",
				email: "foo@sample.com",
				password: "foobar"
			}
			await userController.register(req, res, next);
			const user = await User.findOne({email: 'foo@sample.com'})

			expect(next).toHaveBeenCalled();
		})
		test('view/異常系/メールアドレスが重複している場合', async () => {
			req.body = {
				firstName: "foo",
				lastName: "bar",
				email: "foo@sample.com",
				password: "foobar"
			}
			await User.insertMany(req.body);

			await userController.register(req, res, next);
			const locals = {
				errors: [{
					value: '',
					msg: '登録済みのメールアドレスです',
					param: 'email',
					location: 'db'
				}],
				original: req.body
			}
			expect(res.render).toHaveBeenCalledWith('./account/register.ejs', locals);
		})
		test('db/正常系', async () => {
			req.body = {
				firstName: "foo",
				lastName: "bar",
				email: "foo@sample.com",
				password: "foobar"
			}
			await userController.register(req, res, next);
			const user = await User.findOne({email: 'foo@sample.com'})

			expect(user["firstName"]).toEqual(req.body.firstName);
			expect(user["lastName"]).toEqual(req.body.lastName);
			expect(user["email"]).toEqual(req.body.email);
			expect(bcrypt.compareSync(req.body.password, user["password"])).toBeTruthy()
		})
	});

	describe('showのテスト', () => {
		test('view/正常系', async () => {
			// データの追加
			const mockItem = {
				"name": "天皇の国史",
				"price": 1980,
				"releaseDate": "2020/08/13",
				"category": "社会/政治",
				"description": "これまで通史といえば、目まぐるしく交代する権力者を中心とした政治史が一般的だった。本書はそれとは異なり、二千年来変わることがなかった天皇を軸として、国史を取り纏めたものである。故に主題を『天皇の国史』としている",
				"photoURL": "1.jpg"
			}
			const mockAddress = {
				firstName: "foo",
				lastName: "bar",
				telephone: 1234567890,
				zipCode: 1234567,
				address: "東京都新宿区1丁目"
			}
			await Promise.all([Item.insertMany(mockItem), Address.insertMany(mockAddress)])

			const insertedItem = await Item.findOne({name: "天皇の国史"});
			const insertedAddress = await Address.findOne({firstName: "foo"})

			const mockUser = {
				firstName: "foo",
				lastName: "bar",
				email: "sample@sample.com",
				password: "foobar",
				defaultAddress: insertedAddress["_id"]
			}
			const mockOrderItem = {
				item: insertedItem["_id"],
				quantity: 2,
			}
			await Promise.all([User.insertMany(mockUser), OrderItem.insertMany(mockOrderItem)])

			const insertedUser = await User.findOne({firstName: "foo"});
			const insertedOrderItem = await OrderItem.findOne({quantity: 2})

			const mockOrder = {
				user: insertedUser["_id"],
				orderItems: [insertedOrderItem["_id"]],
				subTotal: 1980,
				tax: 198,
				total: 2178,
				orderDate: Date.now(),
				destinationAddress: insertedAddress["_id"],
				paymentMethod: 1,
				status: 1,
			}
			await Order.insertMany(mockOrder)

			const userInfo = await User.findOne({firstName: "foo"}, {password: 0})
				.populate("defaultAddress")
			req.user = userInfo;
			const orders = await Order.find({})
				.populate("orderItems")
				.populate("destinationAddress")

			async function populateItem(orderItems) {
				let populated = [];
				for (let orderItem of orderItems) {
					const item = await OrderItem.findById(orderItem._id)
						.populate("item");
					populated.push(item);
				}
				return populated;
			};

			// itemをjoinした結果を取得
			if (orders) {
				for (const order of orders) {
					order.orderItems = await populateItem(order.orderItems);
				}
			}

			req.user = userInfo
			const locals = {
				userInfo: userInfo,
				orders: orders,
				totalPage: 1,
				currentPage: 1,
			}

			await userController.show(req, res);

			expect(res.render).toHaveBeenCalled();
		})
	});
});