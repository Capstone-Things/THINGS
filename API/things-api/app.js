var express = require('express');
var pg = require('pg');
var db_info = require('./db_info.js')
var app = express();
var pool = new pg.Pool(db_info.config);

app.get('/', function (req, res) {
  res.jsonp('Hello World!');
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
app.get('/checkout/:id/:person/:qty', function(req, res) {
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
app.get('/checkin/:id/:person/:qty', function(req, res) {
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
app.get('/add/:name/:desc/:price/:thresh', function(req, res){
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
app.get('/tagitem/:id/:tag', function(req, res){
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
* /path     /stats/:id
* /params
*
*
* /brief    Route to pull satistics for an item
*           should probably be renamed to be more specific
*
* /author   Andrew McCann
* /date     2/3/2017
****************************************************/
app.get('/stats/:id', function(err, client, done) {
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('Error fetching client from pool', err);
        }
        /*
        client.query('INSERT INTO transactions(item_id, person, qty_changed) VALUES ($1, $2, $3)', [id, person, qty], function(err, result) {
        client.query('SELECT item_name, quantity, blahbalh
        client.query('SELECT * FROM transactions WHERE item_name = id', [], function(err, result) {
            done();

            if(err)
                return console.error('Error returned from DB', err);

            res.jsonp(result.rows);
        }*/
    });
});



/****************************************************
* /path     /stats/range/:start_date/:end_date
* /params   :start_date - Beginning of time frame
*           :end_date - End of time frame
*
* /brief    Route to pull all stats from a date_range
*
* /author   Andrew McCann
* /date     2/3/2017
****************************************************/
app.get('/stats/range/:start_date/:end_date', function(err, client, done) {
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('Error fetching client from pool', err);
        }
        /*
        client.query('SELECT * FROM transactions WHERE date <= end_date AND date >= start_date', [], function(err, result) {
            done();
            if(err) {
                return console.error('Error resulting from query', err);
            }
        } */
    });

});



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


app.listen(3000, function () {
  console.log('Listening on port 3000');
});
