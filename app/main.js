'use strict';

const express = require('express'),
	layouts = require("express-ejs-layouts"),
	favicon = require('serve-favicon'),
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
	MONGODB_HOSTS = process.env.MONGODB_HOSTS || "localhost:27017,localhost:27018,localhost:27019",
	MONGODB_DATABASE = process.env.MONGODB_DATABASE || "nodec",
	MONGODB_REPLICASET = process.env.MONGODB_REPLICASET || "rs",
	app = express();

const uri = `mongodb://${MONGODB_HOSTS}/${MONGODB_DATABASE}?replicaSet=${MONGODB_REPLICASET}`;

// DB
mongoose
	.set('useCreateIndex', true)
	.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then(() => console.log(`Database Connected to ${uri}`))
	.catch(err => console.log(err));


// テンプレートエンジン
app.set('view engine', 'ejs');
app.use(layouts);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(favicon('./public/favicon.ico'));

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
