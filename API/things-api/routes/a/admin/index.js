// this is routs/a/admin/index.js
// this framework inspiration comes from Scotch.io
// https://scotch.io/tutorials/keeping-api-routing-clean-using-express-routers
const routes = require('express').Router();
const checkin = require('./checkin');
const addNewItem = require('./add_new_item');
const addTag = require('./add_tag');
const shoppingList = require('./shopping_list');

//adding authentication middleware for Admin level here
routes.use(function(req, res, next){
    //The previous level should have authorized the token, all we need
    //to do here is make sure the user has a valid admin field.
    if(req.decoded.admin === true){
      //this is a valid account we do not need to do anything special.
      next();
    }else {
      //this is not an admin account, sorry!
      return res.status(403).send({
          success: false,
          message: 'You do not have the proper credentials to access this page.'
      });
    }
});

//add route handelers for subfolders here:

//any route specific middleware should be added here:

//add route handelers for this directorys routes here:
routes.post('/checkin/:id/:person/:qty', checkin);
routes.put('/add/:name/:desc/:price/:thresh', addNewItem);
routes.post('/tagitem/:id/:tag', addTag);
routes.get('/shopping_list', shoppingList);
//this is an inline route handler...
//this is where you land if you goto GET https://localhost:3000/a/admin/
routes.get('/', (req, res) => {
  res.status(200).json({ message: 'You have connected to SECURE ADMIN CATTHINGS API!' });
});


//Export our router to the the parent router.
module.exports = routes;
