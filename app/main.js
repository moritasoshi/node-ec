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
	User = require("./models/user"),
	PORT = 3000,
	app = express();


// DB
mongoose
	// .connect('mongodb://localhost:30001,localhost:30002,localhost:30003/nodec?replicaSet=rs0', {
	.connect('mongodb://localhost/nodec', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('Database Connected...'))
	.catch(err => console.log(err));

// テンプレートエンジン
app.set('view engine', 'ejs');
app.use(layouts);
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));

// 認証
app.use(passport.initialize());
app.use(flash());
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
			if (user.password !== password) {
				return done(null, false, {message: 'パスワードが正しくありません。'});
			}
			return done(null, user);
		});
	}
));

// セッション管理
app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: false,
}));
passport.serializeUser((user, done) => {
	console.log('Serialize ...');
	done(null, user);
});

passport.deserializeUser((user, done) => {
	console.log('Deserialize ...');
	done(null, user);
});

app.post('/account/login',
	passport.authenticate('local', {
		failureRedirect: "/account/login",
		failureFlash: true,
		successRedirect: "/",
	})
);

app.use(function (req, res, next) {
	res.locals.user = req.session.passport ? req.session.passport.user : "";
	next();
});

// ルーティング
app.use("/", router);
//app.use("/item", router);
app.get('/', (req, res) => {
	res.render("./sample.ejs");
});

// サーバー
app.listen(PORT);
console.log(`Server running at http://localhost:${PORT}`);
