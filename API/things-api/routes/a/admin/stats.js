/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen

See LICENSE.txt for full information.
*/
module.exports = {

  /****************************************************
  * /path     a/admin/stats/weeklyavg/:item_id
  * /params   :item_id - item_id of what we are looking for
  *
  *
  * /brief    Returns average weekly consumption of item
  ****************************************************/
  weeklyavg: (req, res) => {
    res.app.locals.pool.connect(function(err, client, done) {
        if(err) {
            console.error('Error fetching client from pool', err);
            res.sendStatus(500);
        }
        // Quickly validate if id is an int
        var id = parseInt(req.params.item_id)

        if(req.params.item_id != id) {
            done();
            console.error('Invalid ID number', err);
            res.sendStatus(400);
        }

        // If you want to change this rolling window that is used to calculate the average,
        // just alter the INTERVAL amount per SQL guidelines.
        client.query("SELECT weekly.item_name, weekly.item_id, AVG(sum) AS weekly_avg FROM (SELECT i.item_name, i.item_id, SUM(ABS(t.qty_changed)) FROM transactions AS t, items AS i WHERE t.item_id = $1 AND t.item_id = i.item_id AND t.qty_changed < 0 AND t.timestamp > (current_timestamp - INTERVAL '3 months') GROUP BY i.item_name, i.item_id, date_trunc('week', timestamp)) AS weekly GROUP BY 1,2", [id], function(err, result) {
            done();
            res.app.locals.helpers.errResultHandler(err, result.rows, res);
        });
    });
  },
  /****************************************************
  * /path     a/admin/stats/threshold/:item_id
  * /params   :item_id - item_id of what we are looking for
  *
  *
  * /brief    Returns the rough day count between most recent
  *           checkin, and threshold.
  *
  * /author   Andrew McCann
  * /date     2/26/2017
  ****************************************************/
  threshold: (req, res) => {
    res.app.locals.pool.connect(function(err, client, done) {
        if(err) {
            console.error('Error fetching client from pool', err);
            res.sendStatus(500);
        }
        // Quickly validate if id is an int
        var id = parseInt(req.params.item_id)

        if(req.params.item_id != id) {
            done();
            console.error('Invalid ID number', err);
            res.sendStatus(400);
        }
        client.query("WITH last_checkin AS (SELECT MAX(timestamp) FROM transactions AS t2 WHERE t2.qty_changed > 0 AND t2.item_id = $1) SELECT i.item_name, t.item_id, EXTRACT(DAY FROM age(t.timestamp, (SELECT max from last_checkin))) AS days_til_threshold FROM transactions AS t, items AS i WHERE t.item_id = $1 AND i.item_id = t.item_id AND t.qty_remaining < i.threshold AND t.timestamp > (SELECT max from last_checkin)", [id], function(err, result) {
            done();
            res.app.locals.helpers.errResultHandler(err, result.rows, res);
        });
    });
  },

  /****************************************************
  * /path     a/admin/stats/avgperday/:item_id
  * /params   :item_id - item_id of what we are looking for
  *
  *
  * /brief    Gets the average usage (aka checkout/day) by
  *           day of the week.
  ****************************************************/
  avg: (req, res) => {
    res.app.locals.pool.connect(function(err, client, done) {
        if(err) {
           console.error('Error fetching client from pool', err);
           res.sendStatus(500);
        }
        // Quickly validate if id is an int
        var id = parseInt(req.params.item_id);

        if(req.params.item_id != id) {
            done();
            console.error('Invalid ID number', err);
            res.sendStatus(400);
        }

        // OLD QUERY: SELECT i.item_name, i.item_id, ABS(SUM(t.qty_changed)) AS checkout_per_day, to_char(timestamp, 'day') AS dow FROM transactions AS t, items AS i WHERE t.item_id = $1 AND t.item_id = i.item_id AND t.qty_changed < 0 AND t.timestamp > (current_timestamp - INTERVAL '3 months') GROUP BY i.item_id, i.item_name, dow

        client.query("SELECT * FROM checkout_per_day WHERE item_id = $1", [id], function(err, result) {
            done();
            res.app.locals.helpers.errResultHandler(err, result.rows, res);
        });
    });
  },
  /****************************************************
  * /path     a/admin/stats/avgperday/
  * /params   None
  *
  *
  * /brief    Route to pull satistics for all items
  *           Returns the net change in qty/day for
  *           the past week
  ****************************************************/
  avg_All: (req, res) => {
    res.app.locals.pool.connect(function(err, client, done) {
        if(err) {
           console.error('Error fetching client from pool', err);
           res.sendStatus(500);
        }

        // OLD QUERY: SELECT i.item_name, i.item_id, ABS(SUM(t.qty_changed)) AS checkout_per_day, to_char(timestamp, 'day') AS dow FROM transactions AS t, items AS i WHERE t.item_id = $1 AND t.item_id = i.item_id AND t.qty_changed < 0 AND t.timestamp > (current_timestamp - INTERVAL '3 months') GROUP BY i.item_id, i.item_name, dow

        client.query("SELECT * FROM checkout_per_day", function(err, result) {
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
  ****************************************************/
  item_id: (req, res) => {
    res.app.locals.pool.connect(function(err, client, done) {
        if(err) {
            console.error('Error fetching client from pool', err);
            res.sendStatus(500);
        }
        // Quickly validate if id is an int
        var id = parseInt(req.params.item_id);
        if(req.params.item_id != id) {
            done();
            console.error('Invalid ID number', err);
            res.sendStatus(400);
        }

        client.query("SELECT i.item_name, i.item_id, SUM(t.qty_changed) AS Net_Change, to_char(timestamp, 'day') AS dow FROM (SELECT * FROM transactions WHERE timestamp > current_date - interval '7 days') AS t, items AS i WHERE t.item_id = $1 AND t.item_id = i.item_id GROUP BY i.item_name, i.item_id, dow", [id], function(err, result) {
            done();

            res.app.locals.helpers.errResultHandler(err, result.rows, res);
        });
    });
  }


}
