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

    transaction(req.params.id, req.params.person, -req.params.qty, function(err, tranRes) {
        if (err) {
            res.status(500);
            res.jsonp('Database Error');
        } else {
            res.status(200);
            res.jsonp(tranRes);
        }
    });
});


/****************************************************
* /path     /checkin/:id/:person/:qty
* /params   id
*           person
*           qty
* /brief    Route to add item back into inventory
*
* /author   Luke
****************************************************/
app.get('/checkin/:id/:person/:qty', function(req, res) {

    transaction(req.params.id, req.params.person, req.params.qty, function(err, tranRes) {
        if (err) {
            res.status(500);
            res.jsonp('Database Error');
        } else {
            res.status(200);
            res.jsonp(tranRes);
        }
    });
});


/****************************************************
* /path     N/A
* /brief    Helper function for checkin route
*
* /author   Luke
****************************************************/
var transaction = function(id, person, qty, retFunc) {

    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

         client.query('INSERT INTO transactions(item_id, person, qty_changed) VALUES ($1, $2, $3)', [id, person, qty], function(err, result) {
             //call `done()` to release the client back to the pool
             done();

             if(err) {
                 console.error('error running query', err);
                 retFunc(err, null);
             } else {
                 retFunc(null, 'Transaction Completed Successfully');
             }
        });
    });
}


/****************************************************
* /path     /view
* /params   null
* /brief    Display all entries in the table
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
        client.query('SELECT item_name AS name, description, quantity FROM items', [], function(err, result) {
            //call `done()` to release the client back to the pool
            done();

            if(err) {
                return console.error('error running query', err);
            }

            //output: 1
            res.jsonp(result.rows);
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

            if(err) {
                return console.error('error running query', err);
            }

            //output: 1
            res.jsonp(result.rows);
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


app.listen(3000, function () {
  console.log('Listening on port 3000');
});
