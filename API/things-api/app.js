var express = require('express');
var pg = require('pg');
var nodemailer = require('nodemailer');
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

//Request api route
//------------------------------------------------------------------------------
app.post('/request/', function(req, res) {
    var header_data = req.header;
    var name = header_data['itemName'];
    var num = header_data['quantityNeeded'];
    var desc = header_data['description'];
    var msg = header_data['message'];

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'yahoo',
    auth: {
        user: 'catthingsuser@yahoo.com',
        pass: 'testing12345'
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '"CAT-Things-User" <catthingsuser@yahoo.com>', // sender address
    to: 'aruzicka@pdx.edu', // list of receivers
    subject: 'New Inventory Request from a User', // Subject line
    text: 'A user has requested ' + num + ' ' + name + '\n' + 'With the following description: ' + desc + '\n' + 'Additional Information from user: ' + msg
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
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


app.listen(3000, function () {
  console.log('Listening on port 3000');
});
