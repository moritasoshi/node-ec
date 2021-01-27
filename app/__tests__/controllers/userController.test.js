const userController = require("../../controllers/userController")

describe('controller', () => {
	const req = {};

	const res = {
		render: jest.fn()
	};

	describe('toRegisterのテスト', () => {
		beforeAll(() => {
			res.render.mockClear();
			userController.toRegister(req, res);
		});

		test('正常系', () => {
			expect(res.render).toHaveBeenCalledWith('./account/register.ejs');
		})
	});

});