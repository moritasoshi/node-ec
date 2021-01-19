const {check} = require('express-validator');

module.exports = {
	validateUserRegister: [
		check('firstName')
			.matches("^[ぁ-んァ-ヶー一-龠a-zA-Z0-9]{1,100}$").withMessage('姓は1文字以上100文字以内で入力してください。'),
		check('lastName')
			.matches("^[ぁ-んァ-ヶー一-龠a-zA-Z0-9]{1,100}$").withMessage('名は1文字以上100文字以内で入力してください。'),
		check('email')
			.matches("^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$").withMessage("正しいメールアドレスを入力してください。"),
		check('password')
			.matches("^([a-zA-Z0-9]{5,})$").withMessage("パスワードは5文字以上の英数字で入力してください。"),
	],
	validateAddressRegister: [
		check('firstName')
			.matches("^[ぁ-んァ-ヶー一-龠a-zA-Z0-9]{1,100}$").withMessage('姓は1文字以上100文字以内で入力してください。'),
		check('lastName')
			.matches("^[ぁ-んァ-ヶー一-龠a-zA-Z0-9]{1,100}$").withMessage('名は1文字以上100文字以内で入力してください。'),
		check('telephone')
			.matches("^[0-9]{10,11}$").withMessage("半角数字10~11桁の電話番号を入力してください。"),
		check('zipCode')
			.matches("^[0-9]{7,7}$").withMessage("半角数字7桁の郵便番号を入力してください。"),
		check('address')
			.matches("^[ぁ-んァ-ヶー一-龠a-zA-Z0-9]{1,255}$").withMessage("住所は255文字以内で入力してください。"),
	]
}