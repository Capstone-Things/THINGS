//helper_functions.js Exports a number of funtions that are used in various
// templates.  by locating the functions here, functions from different
// directories can gain access after we attatch this object to the app.locals variable

module.exports = {
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
  errResultHandler: function(err, result, res) {
      if (err) {
        res.status(500);
        res.jsonp('Database Error');
      } else {
        res.status(200);
        res.jsonp(result);
      }
  },

  /****************************************************
  * /func name  transaction
  * /brief      Helper function for checkin route
  *
  * /author     Luke
  ****************************************************/
  transaction: function(id, person, qty, retFunc, res) {

      res.app.locals.pool.connect(function(err, client, done) {
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

};
