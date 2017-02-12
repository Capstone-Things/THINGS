//Import Packages
var express = require('express'); //Express is the Node Server Framework
var bodyParser = require('body-parser')//for parsing the body of POST's
var cookieParser = require('cookie-parser')//for parsing cookies
var pg = require('pg'); // pg is a library for connecting to the postgresql Database
var fs = require('fs'); // fs give us file system access
var https = require('https'); // this will allow us to host a https server
var jwt = require('jsonwebtoken');//JWT library
var morgan = require('morgan');//for logging requests
var cors = require('cors')//package to handle Cross Origin Resource Sharing

//Import Config files
var db_info = require('./conf/db/db_info.js'); //This file contains all of the configuration info needed to connect to the database.
var keyFile =  fs.readFileSync('./conf/ssl/server.key'); //the key for SSL
var certFile=  fs.readFileSync('./conf/ssl/server.crt'); //ssl cert(self signed)
var tokenSecret = fs.readFileSync('./conf/jwtSecret.key', 'utf-8').replace(/\s/g, '');


//Instanciate global variables.
var app = express(); // This is our Express Application.
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true}));  //support encoded bodies
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());
var pool = new pg.Pool(db_info.config); //This is the pool that DB client connections live in.



app.get('/', function (req, res) {
  res.jsonp('Hello World!');
});

/****************************************************
* Path: /authorize
* HTTP Method: POST
* Params: Username, Password
* Brief: This route will Authenticate the user and return a JSON token
*     that is valid for 1 week
*
* Author: Nick McHale
****************************************************/
app.post('/authenticate', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

	//Look up user in Database
  pool.connect(function(err, client, done) {
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
                var token = jwt.sign(payload, tokenSecret, {expiresIn: '7d'});
                res.set('token', token);//attatch the token as a header
                res.set('username', data.username);// attatch the username as a header
                res.set('admin', data.admin);// attatch admin status as a header
                res.sendStatus(200);//send 200 response code.
              }
          }
    });
  });
});

/****************************************************
* /path     /checkout/:id/:person/:qty
* /params   id
*           person
*           qty
* /brief    Route to remove some :qty from inventory
*
* /author   Luke?
****************************************************/
app.post('/checkout/:id/:person/:qty', function(req, res) {
    transaction(req.params.id, req.params.person, -req.params.qty, errResultHandler, res);
});


/****************************************************
* /path     /checkin/:id/:person/:qty
* /params   id
*           person
*           qty
* /brief    Route to add quantity to an existing item in the inventory
*
* /author   Luke
****************************************************/
app.post('/checkin/:id/:person/:qty', function(req, res) {
    transaction(req.params.id, req.params.person, req.params.qty, errResultHandler, res);
});



/****************************************************
* /func name  transaction
* /brief      Helper function for checkin route
*
* /author     Luke
****************************************************/
var transaction = function(id, person, qty, retFunc, res) {

    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

         client.query('INSERT INTO transactions(item_id, person, qty_changed) VALUES ($1, $2, $3)', [id, person, qty], function(err, result) {
            //call `done()` to release the client back to the pool
            done();

            if(err) {
                console.error('error running query', err);
                retFunc(err, null, res);
            } else {
                retFunc(null, 'Transaction Completed Successfully', res);
            }
        });
    });
}


/****************************************************
* /path     /view
* /params   null
* /brief    Display all entries in the items table
*
* /author   <insert name>
****************************************************/
app.get('/view', function(req, res){
  //first query the database
  //then return the results to the user

      pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT item_id, item_name AS name, description, quantity FROM items', [], function(err, result) {
            //call `done()` to release the client back to the pool
            done();
            errResultHandler(err, result.rows, res);
        });
    });
});



/****************************************************
* /path     /add/:name/:desc/:price/:thresh
* /params   name - the name of the item
*           desc - the item description
*           price - the price of the item in decimal form
*           thresh - the threshold to notify the admin if the quantity drops below
*
* /brief    Add new item api route, used to insert rows into
*
* /author   Austen & Luke
* /date     2/7/2017
****************************************************/
app.put('/add/:name/:desc/:price/:thresh', function(req, res){
  //first query the database
  //then return the results to the user

      pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO items(item_name, description, price, threshold) VALUES ($1, $2, $3, $4)',
        [req.params.name, req.params.desc, req.params.price, req.params.thresh], function(err, result) {
            //call `done()` to release the client back to the pool
            done();
            errResultHandler(err, 'Item Added Successfully', res);
        });
    });
});



/****************************************************
* /path     /tagitem/:id/:tag
* /params   :id - The id of the item to tag
*           :tag - the name of the tag to give the item
*
* /brief    Add a tag to an item given its id
*
* /author   Luke
* /date     2/7/2017
****************************************************/
app.post('/tagitem/:id/:tag', function(req, res){
  //first query the database
  //then return the results to the user

      pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO tags VALUES ($1, $2)',
                    [req.params.tag, req.params.id], function(err, result) {
            //call `done()` to release the client back to the pool
            done();
            errResultHandler(err, 'Tag Added Successfully', res);
        });
    });
});



/****************************************************
* /path     /shoppinglist
* /params   null
* /brief    Returns all items with quantity less than threshold
*
* /author   Luke
****************************************************/
app.get('/shoppinglist', function(req, res){
  //first query the database
  //then return the results to the user

      pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT item_name AS name, description, price FROM items WHERE quantity < threshold', [], function(err, result) {
            //call `done()` to release the client back to the pool
            done();
            errResultHandler(err, result.rows, res);
        });
    });
});



/****************************************************
* /path     /stats/:name
* /params   :name - item_naem of what we are looking for
*
*
* /brief    Route to pull satistics for an item
*           should probably be renamed to be more specific
*
* /author   Andrew McCann
* /date     2/3/2017
****************************************************/
app.get('/stats/:name', function(req, res) {
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('Error fetching client from pool', err);
        }
/*
        // Quickly validate if id is an int
        var id = parseInt(req.params.id)
        if(req.params.id != id) {
            done();
            return(console.error('Invalid ID number', err));
        }
*/
        client.query('SELECT * FROM transactions', [], function(err, result) {
            done();
        //Get transaction history

        //For every 7 day segment times :numweeks?
            //Net change or total?
        
        //Date last out
            //Take max date of transaction AND qty_change < 0
        //Date last in 
            //Take max of date of trans AND qty_changed > 0


            errResultHandler(err, result.rows, res);
        });
    });
});


/****************************************************
* /path     /history/recent
* /params   :entries? - OPTIONAL, add int value to 
*           specify number of recents
*
* /brief    Route to get last 15 transactions
*
* /author   Andrew McCann
* /date     2/10/2017
****************************************************/
app.get('/history/recent/:entries?', function(req, res) {
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('Error fetching client from pool', err);
        }
        var entries = 15
        if(req.params.entries) {
            entries = req.params.entries
        }
        // TODO:> Define what attributes we actually want to display.
        // would be cool if we had a VERBose flag.
        client.query('SELECT * FROM transactions ORDER BY timestamp DESC LIMIT $1', [entries], function(err, result) {
            done();
           errResultHandler(err, result.rows, res);
        });
    });
});



/****************************************************
* /path     /history/:name
* /params   :name - name of the item
*           :entries? - OPTIONAL, add int value to 
*           specify number of recents
*
* /brief    Route to get last 15 transactions of a 
*           specific item
*
* /author   Andrew McCann
* /date     2/10/2017
****************************************************/
app.get('/history/:name/:entries?', function(req, res) {
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('Error fetching client from pool', err);
        }
        var entries = 15
        if(req.params.entries) {
            entries = req.params.entries
        }
        var name = req.params.name
        if(name === 'undefined') {
            console.log('Nobueno')
        }
        //TODO:> Cut down on the attributes
        client.query('SELECT * FROM transactions AS t, items AS i WHERE i.item_name = $2 AND t.item_id = i.item_id ORDER BY timestamp DESC LIMIT $1', [entries, name], function(err, result) {
            done();
           errResultHandler(err, result.rows, res);
        });
    });
});



/****************************************************
* /path     /history/bytag/:tag
* /params   :name - name of the item
*           :entries? - OPTIONAL, add int value to 
*           specify number of recents
*
* /brief    Route to get last 15 transactions of a 
*           specific item
*
* /author   Andrew McCann
* /date     2/10/2017
****************************************************/
app.get('/historybytag/:tag/:entries?', function(req, res) {
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('Error fetching client from pool', err);
        }
        var entries = 15
        if(req.params.entries) {
            entries = req.params.entries
        }
        var tag = req.params.tag
        if(tag === 'undefined') {
            console.log('Nobueno')
        }
        name = tag.toLowerCase()
        //TODO:> Results, and console log above, route name is sloppy. Differentiate without collision?
        client.query('SELECT * FROM transactions AS t, tags WHERE LOWER(tags.tag_name) = $2 AND t.item_id = tags.item_id ORDER BY timestamp DESC LIMIT $1', [entries, name], function(err, result) {
            done();
           errResultHandler(err, result.rows, res);
        });
    });
});



/****************************************************
* /path     /history/:start_date/:end_date
* /params   :start_date - Beginning of time frame
*           :end_date - End of time frame
*
* /brief    Route to get a window of transactions and 
*           some related information
*
* /author   Andrew McCann
* /date     2/10/2017
****************************************************/
app.get('/history/:start_date/:end_date', function(req, res) {
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('Error fetching client from pool', err);
        }
        //Date validation is a tricky problem I am 
        //pretending does not exist for now
        var start_date = req.params.start_date
        var end_date = req.params.end_date

        client.query('SELECT * FROM transactions AS t LEFT JOIN items AS i ON t.item_id = i.item_id WHERE cast(timestamp as date) <= $2 AND cast(timestamp as date) >= $1', [start_date, end_date], function(err, result) {
            done();

            errResultHandler(err, result.rows, res);
        });
    });
});


/****************************************************
* /route    /edit/????
* /params   
*           
*
* /brief    This route allows for the modification of
*           fields
*
* /author   
* /date     
****************************************************/
//
//
//
//

/****************************************************
* /func name  errResultHandler
* /params     :err - the error that occured, null if none
*             :result - the result of the database query
                      (either the rows returned or success message)
              :res - the function to handle the responding the result
*
* /brief      Responds with a meaningful status and returns the results
*
* /author     Luke
* /date       2/7/2017
****************************************************/
var errResultHandler = function(err, result, res) {
    if (err) {
      res.status(500);
      res.jsonp('Database Error');
    } else {
      res.status(200);
      res.jsonp(result);
    }
}


/****************************************************
* /route    /secretdelete/:table/:id
* /params   :table - Table to delete from
*           :id - item_id
*
* /brief    Secret delete function for use during dev
*           Either never document, or remove prior to
*           delivery
*
* /author     Andrew McCann
* /date       2/10/2017
****************************************************/
app.delete('/secretdelete/:table/:id', function(req, res) {
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('Error fetching client from pool', err);
        }
        var id = parseInt(req.params.id)
        if(id != req.params.id) {
            done();
            return console.error('Invalid item ID', err);
        }   
        client.query('DELETE FROM $2 WHERE item_id = $1', [id, req.params.table], function(err, result) {
            done();
            errResultHandler(err, result.rows, res);
        });
    });

});

app.get('/secretview/tags/', function(req, res) {
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('Error fetching client from pool', err);
        }
        client.query('SELECT * FROM tags', [], function(err, result) {
            done();
            errResultHandler(err, result.rows, res);
        });
        
    });
});
app.get('/secretview/transactions/', function(req, res) {
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('Error fetching client from pool', err);
        }
        client.query('SELECT * FROM transactions', [], function(err, result) {
            done();
            errResultHandler(err, result.rows, res);
        });
        
    });
});

//This will launch our server, and pass it to the express app.
https.createServer({
	key: keyFile,
	cert: certFile
}, app).listen(3000, function() {
	console.log('Listening on port 3000');
});


//The following is depreciated as we are launching with a HTTPS server
/*
app.listen(3000, function () {
  console.log('Listening on port 3000');
});
*/
