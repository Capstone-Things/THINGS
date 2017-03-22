/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen

See LICENSE.txt for full information.
*/

//This module will export the various /history routes
module.exports= {

  /****************************************************
  * /path     /history/recent/:entries?
  * /params   :entries? - OPTIONAL, add int value to
  *           specify number of recents
  *
  * /brief    Route to get last 15 transactions
  ****************************************************/
  recent: (req,res)=>{
    res.app.locals.pool.connect(function(err, client, done) {
        if(err) {
            console.error('Error fetching client from pool', err);
            res.sendStatus(500);
        }
        var entries = 15
        if(req.params.entries) {
            entries = req.params.entries
        }
        // TODO:> Define what attributes we actually want to display.
        // would be cool if we had a VERBose flag.
        client.query('SELECT * FROM transactions ORDER BY timestamp DESC LIMIT $1', [entries], function(err, result) {
            done();
           res.app.locals.helpers.errResultHandler(err, result.rows, res);
        });
    });
  },
  /****************************************************
  * /path     /history/by_item/:name/:entries?
  * /params   :name - name of the item
  *           :entries? - OPTIONAL, add int value to
  *           specify number of recents
  *
  * /brief    Route to get last 15 transactions of a
  *           specific item
  ****************************************************/
  item: (req,res)=>{
    res.app.locals.pool.connect(function(err, client, done) {
        if(err) {
            console.error('Error fetching client from pool', err);
            res.sendStatus(500);
        }
        var entries = 15
        if(req.params.entries) {
            entries = req.params.entries
        }
        var name = req.params.name
        if(name === 'undefined') {
            console.log('Nobueno')
        }

        // Columns cannot be parameterized in node-pg
        var columns = 'i.item_id, i.item_name, t.transaction_id, t.person,  t.qty_changed, t.qty_remaining, t.timestamp'

        var stmt = 'SELECT '  + columns + ' FROM transactions AS t, items AS i WHERE i.item_name = $1 AND t.item_id = i.item_id ORDER BY timestamp DESC LIMIT $2'

        client.query(stmt, [name, entries], function(err, result) {
            done();
           res.app.locals.helpers.errResultHandler(err, result.rows, res);
        });
    });
  },

  /****************************************************
  * /path     /history/by_tag/:tag/:entries?
  * /params   :name - name of the item
  *           :entries? - OPTIONAL, add int value to
  *           specify number of recents
  *
  * /brief    Route to get last 15 transactions of a
  *           specific item
  ****************************************************/
  tag: (req,res)=>{
    res.app.locals.pool.connect(function(err, client, done) {
        if(err) {
            console.error('Error fetching client from pool', err);
            res.sendStatus(500);
        }
        var entries = 15
        if(req.params.entries) {
            entries = req.params.entries
        }
        var tag = req.params.tag
        if(tag === 'undefined') {
            console.log('Nobueno')
        }
        name = tag.toLowerCase()
        //TODO:> Results, and console log above, route name is sloppy. Differentiate without collision?
        client.query('SELECT * FROM transactions AS t, tags WHERE LOWER(tags.tag_name) = $2 AND t.item_id = tags.item_id ORDER BY timestamp DESC LIMIT $1', [entries, name], function(err, result) {
            done();
           res.app.locals.helpers.errResultHandler(err, result.rows, res);
        });
    });
  },

  /****************************************************
  * /path     /history/by_range/:start_date/:end_date
  * /params   :start_date - Beginning of time frame
  *           :end_date - End of time frame
  *
  * /brief    Route to get a window of transactions and
  *           some related information
  ****************************************************/
  timespan: (req,res)=>{
    res.app.locals.pool.connect(function(err, client, done) {
        if(err) {
            console.error('Error fetching client from pool', err);
            res.sendStatus(500);
        }
        //Date validation is a tricky problem I am
        //pretending does not exist for now
        var start_date = req.params.start_date
        var end_date = req.params.end_date

        client.query('SELECT * FROM transactions AS t LEFT JOIN items AS i ON t.item_id = i.item_id WHERE cast(timestamp as date) <= $2 AND cast(timestamp as date) >= $1',
          [start_date, end_date], function(err, result) {
            done();
            if(err){
              console.error("Database error on History by timespan", err);
              res.sendStatus(500);
            }
            else{
              res.app.locals.helpers.errResultHandler(err, result.rows, res);
            }
        });
    });
  }
}
