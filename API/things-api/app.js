var express = require('express');
var pg = require('pg');
var db_info = require('./db_info.js')
var app = express();
var pool = new pg.Pool(db_info.config);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/items', function(req, res){
  //first query the database
  //then return the results to the user

  pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM items', [], function(err, result) {
    //call `done()` to release the client back to the pool
      done();

      if(err) {
        return console.error('error running query', err);
      }
      console.log(result.rows[0].number);
      //output: 1
      res.send(result.rows);
  });
});


});

app.listen(3000, function () {
  console.log('Listening on port 3000');
});
