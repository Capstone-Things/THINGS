/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen

See LICENSE.txt for full information.
*/
/****************************************************
* /path     /shoppinglist
* /params   null
* /brief    Returns all items with quantity less than threshold
****************************************************/
module.exports=(req,res) => {
  //first query the database
  //then return the results to the user

      res.app.locals.pool.connect(function(err, client, done) {
        if(err) {
            console.error('error fetching client from pool', err);
            res.sendStatus(500);
        }
        client.query('SELECT item_name AS name, description, price, quantity FROM items WHERE quantity < threshold', [], function(err, result) {
            //call `done()` to release the client back to the pool
            done();
            res.app.locals.helpers.errResultHandler(err, result.rows, res);
        });
    });

};
