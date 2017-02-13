//Import Packages
var express = require('express'); //Express is the Node Server Framework
var bodyParser = require('body-parser')//for parsing the body of POST's
var cookieParser = require('cookie-parser')//for parsing cookies
var pg = require('pg'); // pg is a library for connecting to the postgresql Database
var fs = require('fs'); // fs give us file system access
var https = require('https'); // this will allow us to host a https server
var morgan = require('morgan');//for logging requests
var cors = require('cors');//package to handle Cross Origin Resource Sharing
var routes = require('./routes');
var helpers = require('./helper_functions')
var tokenSecret = fs.readFileSync('./conf/jwtSecret.key', 'utf-8').replace(/\s/g, '');

//Import Config files
var db_info = require('./conf/db/db_info'); //This file contains all of the configuration info needed to connect to the database.
var keyFile =  fs.readFileSync('./conf/ssl/server.key'); //the key for SSL
var certFile=  fs.readFileSync('./conf/ssl/server.crt'); //ssl cert(self signed)



//Instanciate global variables.
var app = express(); // This is our Express Application.
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true}));  //support url encoded bodies
app.use(cookieParser()); // midleware to parses cookies
app.use(morgan('dev')); // enables console output for dev purpouses on requests
app.use(cors()); // allow cross origin resource sharing
var pool = new pg.Pool(db_info.config); //This is the pool that DB client connections live in.

//any global helper functions for our templates should go here:
app.locals.helpers = helpers;
app.locals.tokenSecret = tokenSecret;


// We need to be able to access the pool from our templates,
// store the pool in app.locals
app.locals.pool = pool;
app.use('/', routes);//import our routs this will import the routes
//This will launch our server, and pass it to the express app.
https.createServer({
	key: keyFile,
	cert: certFile
}, app).listen(3000, function() {
	console.log('Listening on port 3000');
});

//The following is depreciated as we are launching with a HTTPS server
//uncomment the following to use http and comment out the above code
/*
app.listen(3000, function () {
  console.log('Listening on port 3000');
});
*/
