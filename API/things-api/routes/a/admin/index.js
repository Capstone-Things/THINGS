// this is routs/a/admin/index.js
// this framework inspiration comes from Scotch.io
// https://scotch.io/tutorials/keeping-api-routing-clean-using-express-routers
const routes = require('express').Router();
const checkin = require('./checkin');

//add route handelers for subfolders here:

//any route specific middleware should be added here:

//add route handelers for this directorys routes here:
routes.post('/checkin/:id/:person/:qty', checkin);
//this is an inline route handler...
//this is where you land if you goto GET https://localhost:3000/a/admin/
routes.get('/', (req, res) => {
  res.status(200).json({ message: 'You have connected to SECURE ADMIN CATTHINGS API!' });
});


//Export our router to the the parent router.
module.exports = routes;
