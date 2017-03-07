// this is routs/index.js
// this framework inspiration comes from Scotch.io
// https://scotch.io/tutorials/keeping-api-routing-clean-using-express-routers
const routes = require('express').Router();
const secure_routes = require('./a/');
const dev = require('./dev/');
const test = require('./test');
const auth = require('./authenticate');
const view = require('./view_items');
const request = require('./request');
//added below----

//var nodemailer = require('nodemailer');

//add route handelers for subfolders here:
routes.use('/a', secure_routes);
routes.use('/dev', dev);

//any route specific middleware should be added here:

//add route handelers for this directorys routes here:
routes.get('/test', test);
routes.get('/view', view);
routes.post('/authenticate', auth);
routes.post('/request', request)

//this is an inline route handler...
//this is where you land if you goto GET https://localhost:3000/
routes.get('/', (req, res) => {
  res.status(200).json({ message: 'You have connected to CATTHINGS API!' });
});


//Export our router to the the parent router.
module.exports = routes;
