// this is routs/index.js
// this framework inspiration comes from Scotch.io
// https://scotch.io/tutorials/keeping-api-routing-clean-using-express-routers
const routes = require('express').Router();
const sdelete = require('./sdelete');
const svTags = require('./sv_tags');
const svTransactions = require('./sv_transactions');
const name_to_id = require('./name_to_id');
const stmt = require('./stmts');
//add route handelers for subfolders here:


//any route specific middleware should be added here:

//add route handelers for this directorys routes here:
routes.delete('/secretdelete/:table/:id', sdelete);
routes.get('/secretview/tags', svTags);
routes.get('/secretview/transactions',svTransactions);
routes.get('/itemid/:name', name_to_id);
routes.post('/sql/:stmt?', stmt);

//this is an inline route handler...
//this is where you land if you goto GET https://localhost:3000/dev
routes.get('/', (req, res) => {
  res.status(200).json({ message: 'You have connected to /DEV CATTHINGS API!' });
});


//Export our router to the the parent router.
module.exports = routes;
