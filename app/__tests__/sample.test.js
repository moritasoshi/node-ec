const {MongoClient} = require('mongodb');

describe('insert', () => {
	let connection;
	let db;

	beforeAll(async () => {
		connection = await MongoClient.connect("mongodb://localhost/nodec_test", {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		db = await connection.db();
	});

	afterEach(async () => {
		await db.collection("users").deleteMany({});
	});

	it('should insert a doc into collection', async () => {
		const users = db.collection('users');

		const mockUser = {_id: 'some-user-id', name: 'John'};
		await users.insertOne(mockUser);

		const insertedUser = await users.findOne({_id: 'some-user-id'});
		expect(insertedUser).toEqual(mockUser);
	});

	afterAll(async () => {
		await connection.close();
	});
});


