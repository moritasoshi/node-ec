const mongoose = require("mongoose"),
	Item = require("../models/item"),
	itemController = require('../controllers/itemController');

describe('insert', () => {

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

	// テスト前にドキュメントを削除
	beforeEach(async () => {
		await Item.deleteMany({});
	});

	// テスト
	it('should insert a doc into collection2', async () => {
		// データの追加
		const mockItem = {
			"name": "天皇の国史",
			"price": 1980,
			"releaseDate": "2020/08/13",
			"category": "社会/政治",
			"description": "これまで通史といえば、目まぐるしく交代する権力者を中心とした政治史が一般的だった。本書はそれとは異なり、二千年来変わることがなかった天皇を軸として、国史を取り纏めたものである。故に主題を『天皇の国史』としている",
			"photoURL": "1.jpg"
		};

		await Item.insertMany(mockItem); // insert
		const insertedItem = await Item.findOne({name: '天皇の国史'});

		// モックの作成
		const req = {
			params: {
				_id: insertedItem['_id']
			}
		};
		const res = {
			render: jest.fn()
		};
		await res.render.mockClear();

		// テスト対象の呼び出し
		await itemController.show(req, res)

		// 確認
		expect(res.render).toHaveBeenCalledWith('./item/detail.ejs', insertedItem);
	});

	// DB切断
	afterAll(async () => {
		await mongoose.disconnect();
	});
});


