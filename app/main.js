'use strict';

const express = require('express'),
	layouts = require("express-ejs-layouts"),
	router = require("./routes/index"),
	PORT = 3000,
	app = express();

app.set('view engine', 'ejs');
app.use(layouts);
app.use(express.static('public'));

app.use("/", router);

app.get('/', (req, res) => {
	res.send('Hello World');
});

app.listen(PORT);
console.log(`Server running at http://localhost:${PORT}`);
