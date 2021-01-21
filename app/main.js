'use strict';

const express = require('express'),
	layouts = require("express-ejs-layouts"),
	router = require("./routes/index"),
	bodyParser = require('body-parser'),
	mongoose = require("mongoose"),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	session = require('express-session'),
	flash = require('connect-flash'),
	bcrypt = require('bcrypt'),
	User = require("./models/user"),
	PORT = 3000,
	app = express();


// DB
mongoose
	// .connect('mongodb://localhost:30001,localhost:30002,localhost:30003/nodec?replicaSet=rs0', {
	.connect('mongodb://localhost/nodec', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then(() => console.log('Database Connected...'))
	.catch(err => console.log(err));

// テンプレートエンジン
app.set('view engine', 'ejs');
app.use(layouts);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));


// 認証&セッション管理
passport.use(new LocalStrategy({
		usernameField: 'email',
	},
	function (username, password, done) {
		User.findOne({email: username}, function (err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, {message: 'メールアドレスが登録されていません。'});
			}
			if (!bcrypt.compareSync(password, user.password)) {
				return done(null, false, {message: 'パスワードが正しくありません。'});
			}
			return done(null, user);
		});
	}
));

app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());
passport.serializeUser((user, done) => {
	console.log('Serialize ...');
	done(null, user);
});

passport.deserializeUser((user, done) => {
	console.log('Deserialize ...');
	done(null, user);
});

app.use(function (req, res, next) {
	res.locals.user = req['user'];
	next();
});

// ルーティング
app.use("/", router);

// サーバー
app.listen(PORT);
console.log(`Server running at http://localhost:${PORT}`);
