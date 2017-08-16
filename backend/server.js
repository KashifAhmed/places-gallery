var express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	morgan = require('morgan'),
	mongoose = require('mongoose');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port
// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
	// do logging
	console.log("\n================================================================================");
	console.log("HOST", req.headers.host);
	console.log("Remote Address", req.headers['x-forwarded-for'] || req.connection.remoteAddress);
	console.log("URL", req.originalUrl);
	console.log("BODY", req.body);
	console.log("Params", req.params);
	console.log("Query", req.query);
	console.log("================================================================================ \n");
	next();
});

require('./config')(mongoose, app);
require('./app')(mongoose, app, router);

app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
