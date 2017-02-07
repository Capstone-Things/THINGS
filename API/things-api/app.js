var express = require('express');
var pg = require('pg');
var db_info = require('./db_info.js')
var app = express();
var pool = new pg.Pool(db_info.config);

app.get('/', function (req, res) {
  res.send('Hello World!');
});


//Checkout items api route
//------------------------------------------------------------------------------
app.get('/checkout/:id/:person/:qty', function(req, res) {

    transaction(req.params.id, req.params.person, -req.params.qty, function(err, tranRes) {
        if (err) {
            res.status(500);
            res.send('Database Error');
        } else {
            res.status(200);
            res.send(tranRes);
        }
    });
});

//Checkin items api route
//------------------------------------------------------------------------------
app.get('/checkin/:id/:person/:qty', function(req, res) {

    transaction(req.params.id, req.params.person, req.params.qty, function(err, tranRes) {
        if (err) {
            res.status(500);
            res.send('Database Error');
        } else {
            res.status(200);
            res.send(tranRes);
        }
    });
});

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

            if(err) {
                return console.error('error running query', err);
            }

            //output: 1
            res.send(result.rows);
        });
    });
});

//Add new item api route, used to insert rows into 
//------------------------------------------------------------------------------
app.get('/add/:name/:desc/:price/:thresh', function(req, res) {

    additem(req.params.name, req.params.desc, req.params.pr, req.params.thresh, function(err, tranRes) {
        if (err) {
            res.status(500);
            res.send('Database Error');
        } else {
            res.status(200);
            res.send(tranRes);
        }
    });
});

var additem = function(name, desc, pr, thresh, retFunc) {

    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }

         client.query('INSERT INTO items(item_name, description, price, threshold) VALUES ($1, $2, $3, $4)', [name, desc, pr, thresh], function(err, result) {
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

app.listen(3000, function () {
  console.log('Listening on port 3000');
});
