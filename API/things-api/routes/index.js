// this is routs/index.js
// this framework inspiration comes from Scotch.io
// https://scotch.io/tutorials/keeping-api-routing-clean-using-express-routers
const routes = require('express').Router();
const secure_routes = require('./a/');
const test = require('./test');
const auth = require('./authenticate');
//add route handelers for subfolders here:
routes.use('/a', secure_routes)

//add route handelers for this directorys routes here:
routes.get('/test', test);
routes.post('/authenticate', auth);


routes.get('/', (req, res) => {
  res.status(200).json({ message: 'You have connected to CATTHINGS API!' });
});


//Export our router to the the parent router.
module.exports = routes;
