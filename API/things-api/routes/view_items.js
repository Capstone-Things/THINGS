module.exports = (req, res) => {


  /****************************************************
  * /path     /view
  * /params   null
  * /brief    Display all entries in the items table
  *
  * /author   <insert name>
  ****************************************************/
    //first query the database
    //then return the results to the user

        req.app.locals.pool.connect(function(err, client, done) {
          if(err) {
              return console.error('error fetching client from pool', err);
          }
          client.query('SELECT item_id, item_name AS name, description, quantity FROM items', [], function(err, result) {
              //call `done()` to release the client back to the pool
              done();
              res.app.locals.helpers.errResultHandler(err, result.rows, res);
          });
      });
}
