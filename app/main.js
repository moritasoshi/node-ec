'use strict';

const express = require('express'),
	layouts = require("express-ejs-layouts"),
	router = require("./routes/index"),
	bodyParser = require('body-parser'),
	mongoose = require("mongoose"),
	PORT = 3000,
	app = express();

// DB
mongoose.connect('mongodb://localhost:30001/nodec', {useNewUrlParser: true, useUnifiedTopology: true});

// テンプレートエンジン
app.set('view engine', 'ejs');
app.use(layouts);
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));

// ルーティング
app.use("/", router);
app.get('/', (req, res) => {
	res.send('Hello World');
});

// サーバー
app.listen(PORT);
console.log(`Server running at http://localhost:${PORT}`);
