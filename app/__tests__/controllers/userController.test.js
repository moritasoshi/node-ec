const userController = require("../../controllers/userController"),
	User = require("../../models/user"),
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


});