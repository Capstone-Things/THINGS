var jwt = require('jsonwebtoken');//JWT library
var fs = require('fs');
/****************************************************
* Path: /authenticate
* HTTP Method: POST
* Params: Username, Password
* Brief: This route will Authenticate the user and return a JSON token
*     that is valid for 1 week
*
* Author: Nick McHale
****************************************************/
module.exports = (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  //Look up user in Database
  req.app.locals.pool.connect(function(err, client, done) {
      if(err) {
          return console.error('error fetching client from pool', err);
      }

       client.query("SELECT * FROM users WHERE username=$1", [username], function(err, result) {

          //call `done()` to release the client back to the pool
          done();

          if(err) {
              //if not found user is uknown return 401
              console.error('error running query', err);
              res.sendStatus(401);//invalid user

          } else {
              var data = result.rows[0];
              if(!data){
                res.sendStatus(401);
                return console.error('invalid username', username);
              }
              //if our user exsits, lets check their password.
              if(password != data.password){
                res.sendStatus(401);//invalid password
                return console.error('invalid password');
              }
              else{
                //assign a token
                var payload = {
                  username: data.username,
                  admin: data.admin
                };
                //this will create the token using our secret, and set to expire in 1 week
                var token = jwt.sign(payload, res.app.locals.tokenSecret, {expiresIn: '7d'});
                res.set('token', token);//attatch the token as a header
                res.set('username', data.username);// attatch the username as a header
                res.set('admin', data.admin);// attatch admin status as a header
                res.sendStatus(200);//send 200 response code.
              }
          }
    });
  });
};
