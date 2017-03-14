/****************************************************
* /path     /shoppinglist
* /params   null
* /brief    Returns all items with quantity less than threshold
*
* /author   Luke
****************************************************/
module.exports=(req,res) => {
  //first query the database
  //then return the results to the user

      res.app.locals.pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT item_name AS name, description, price, quantity FROM items WHERE quantity < threshold', [], function(err, result) {
            //call `done()` to release the client back to the pool
            done();
            res.app.locals.helpers.errResultHandler(err, result.rows, res);
        });
    });

};
