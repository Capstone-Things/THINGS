// this is routs/a/index.js
// this framework inspiration comes from Scotch.io
// https://scotch.io/tutorials/keeping-api-routing-clean-using-express-routers
var jwt = require('jsonwebtoken');
var fs = require('fs');

const routes = require('express').Router();
const admin = require('./admin');
const checkout = require('./checkout');

//authorization middleware to verify user has a valid token
const credential_check = function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, res.app.locals.tokenSecret, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });
  }
}

routes.use(credential_check);


//add route handelers for subfolders here:
routes.use('/admin', admin);
//any route specific middleware should be added here:

//add route handelers for this directorys routes here:
routes.post('/checkout/:id/:person/:qty', checkout);

//this is an inline route handler...
//this is where you land if you goto GET https://localhost:3000/a/
routes.get('/', (req, res) => {
  res.status(200).json({ message: 'You have connected to SECURE USER AUTHORIZED CATTHINGS API!' });
});


//Export our router to the the parent router.
module.exports = routes;
