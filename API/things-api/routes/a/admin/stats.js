
module.exports = {


  /****************************************************
  * /path     a/admin/stats/avgperday/:item_id
  * /params   :item_id - item_id of what we are looking for
  *
  *
  * /brief    Gets the average usage (aka checkout/day) by
  *           day of the week.
  *
  * /author   Andrew McCann
  * /date     2/19/2017
  ****************************************************/
  avg: (req, res) => {
    res.app.locals.pool.connect(function(err, client, done) {
        if(err) {
            return console.error('Error fetching client from pool', err);
        }
        // Quickly validate if id is an int
        var id = parseInt(req.params.item_id)

        if(req.params.item_id != id) {
            done();
            return(console.error('Invalid ID number', err));
        }

        client.query("SELECT i.item_name, i.item_id, SUM(t.qty_changed) AS checkout_per_day, to_char(timestamp, 'day') AS dow FROM transactions AS t, items AS i WHERE t.item_id = $1 AND t.item_id = i.item_id AND t.qty_changed < 0 GROUP BY i.item_id, i.item_name, dow", [id], function(err, result) {
            done();
            res.app.locals.helpers.errResultHandler(err, result.rows, res);
        });
    });
  },
  /****************************************************
  * /path     a/admin/stats/netperday/:item_id
  * /params   :item_id - item_id of what we are looking for
  *
  *
  * /brief    Route to pull satistics for an item
  *           Returns the net change in qty/day for
  *           the past week
  *
  * /author   Andrew McCann
  * /date     2/19/2017
  ****************************************************/
  item_id: (req, res) => {
    res.app.locals.pool.connect(function(err, client, done) {
        if(err) {
            return console.error('Error fetching client from pool', err);
        }
        // Quickly validate if id is an int
        var id = parseInt(req.params.item_id)
        if(req.params.item_id != id) {
            done();
            return(console.error('Invalid ID number', err));
        }

        client.query("SELECT i.item_name, i.item_id, SUM(t.qty_changed) AS Net_Change, to_char(timestamp, 'day') AS dow FROM (SELECT * FROM transactions WHERE timestamp > current_date - interval '7 days') AS t, items AS i WHERE t.item_id = $1 AND t.item_id = i.item_id GROUP BY i.item_name, i.item_id, dow", [id], function(err, result) {
            done();

            res.app.locals.helpers.errResultHandler(err, result.rows, res);
        });
    });
  }


}
