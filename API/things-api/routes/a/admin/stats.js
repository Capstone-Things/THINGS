/****************************************************
* /path     /stats/:name
* /params   :name - item_naem of what we are looking for
*
*
* /brief    Route to pull satistics for an item
*           should probably be renamed to be more specific
*
* /author   Andrew McCann
* /date     2/3/2017
****************************************************/
module.exports = (req, res) => {

  res.app.locals.pool.connect(function(err, client, done) {
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
      client.query('SELECT * FROM transactions', [], function(err, result) {
          done();
      //Get transaction history

      //For every 7 day segment times :numweeks?
          //Net change or total?

      //Date last out
          //Take max date of transaction AND qty_change < 0
      //Date last in
          //Take max of date of trans AND qty_changed > 0


          res.app.locals.helpers.errResultHandler(err, result.rows, res);
      });
  });
}
