var express = require('express');
var pg = require('pg');
var db_info = require('./db_info.js')
var app = express();
var pool = new pg.Pool(db_info.config);

app.get('/', function (req, res) {
  res.send('Hello World!');
});


//Checkout / Check in items
//------------------------------------------------------------------------------
app.get('/transaction/:id/:person/:qty', function(req, res){
  //first query the database
  //then return the results to the user

  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('INSERT INTO transactions(item_id, person, qty_changed) VALUES ($1, $2, $3)', [req.params.id, req.params.person, req.params.qty], function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        res.send(err);
        return console.error('error running query', err);
      } else {
        res.send('Transaction Completed Successfully');
      }
      console.log(req.params.id);
      console.log(req.params.qty);
      console.log(req.params.person);

      //output: 1
    });
  });
});


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
            res.send(result.rows);
        });
    });
});


app.listen(3000, function () {
  console.log('Listening on port 3000');
});
