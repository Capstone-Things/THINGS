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
* /path     /stats/:name
* /params   :name - item_naem of what we are looking for
*
* /brief    Route to pull satistics for an item
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
        client.query('SELECT * FROM transactions WHERE item_id = $1', [id], function(err, result) {
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
        client.query('SELECT * FROM transactions ORDER BY timestamp DESC LIMIT $1', [entries], function(err, result) {
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

app.listen(3000, function () {
  console.log('Listening on port 3000');
});
