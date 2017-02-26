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

        var errString = '';
        var statusInt = 500;
        if(err.routine == 'pg_atoi') {
          errString = "ERROR: An integer field contained an invalid integer.";
          statusInt = 400; //Bad request
        } else if(err.routine == 'cash_in') {
          errString = "ERROR: An money field contained an invalid value.";
          statusInt = 400; //Bad request
        } else {
          errString = 'Database Error';
        }

        console.error(errString);

        res.status(statusInt);
        res.jsonp(errString);
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
                // If the error is because they checked out too many items,
                if (err.toString().includes("items_quantity_check")) {
                  // Respond with conflict (409) status
                  res.status(409);
                  res.jsonp("ERROR: Transaction not completed because it would result in an item with a negative quantity.");
                } else {
                  //console.error('error running query', err);
                  retFunc(err, null, res);
                }
              } else {
                  retFunc(null, 'Transaction Completed Successfully', res);
              }
          });
      });
  }

};
