const {MongoClient} = require('mongodb');

describe('insert', () => {
	let connection;
	let db;

	// DB接続
	beforeAll(async () => {
		connection = await MongoClient.connect("mongodb://localhost/nodec_test", {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		db = await connection.db();
	});

	// テスト前にドキュメントを削除
	beforeEach(async () => {
		await db.collection("users").deleteMany({});
	});

	// テスト
	it('should insert a doc into collection', async () => {
		const users = db.collection('users');

		const mockUser = {_id: 'some-user-id', name: 'John'};
		await users.insertOne(mockUser); // insert

		const insertedUser = await users.findOne({_id: 'some-user-id'}); // find
		expect(insertedUser).toEqual(mockUser);  // insertしたデータとfindしたデータの一致を確認
	});

	// DB切断
	afterAll(async () => {
		await connection.close();
	});
});


