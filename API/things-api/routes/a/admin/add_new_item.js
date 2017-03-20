/****************************************************
* /path     api/a/admin/add/:name/:qty/:desc/:price/:thresh/:user/:tags
* /params   name - the name of the item
*           desc - the item description
*           price - the price of the item in decimal form
*           thresh - the threshold to notify the admin if the quantity drops below
*
* /brief    Add new item api route, used to insert rows into
*
* /author   Austen & Luke
* /date     2/7/2017
****************************************************/
module.exports = (req, res) => {
  //first query the database
  //then return the results to the user
  var itemID = null;
  var values = '';
  var query = '';
  //parse the tags
  var tags = req.params.tags.split(',');

  //make initial item insert
  query += `INSERT INTO all_items(item_name, description, price, threshold)
  VALUES ('${req.params.name}', '${req.params.desc}', ${req.params.price}, ${req.params.thresh}); `

  //submit transaction to bring qty to initial value.
  query += `INSERT INTO transactions(item_id, person, qty_changed)
  SELECT MAX(item_id), '${req.params.user}', ${req.params.qty}
  FROM all_items; `
  //add tags to item.
  for(i=0; i<tags.length; i++){
    //build up the string of tags to insert
    query += `INSERT INTO tags (tag_name, item_id)
    SELECT '${tags[i]}', MAX(item_id)
    FROM all_items; `

  }// END FOR

  //console.log(query);//DEV OUTPUT

      //checkout a client from the pool
      res.app.locals.pool.connect(function(err, client, done) {
        if(err) {
            console.error('error fetching client from pool', err);
            res.sendStatus(500);
        }
        //submit the query to the Database
        client.query(query, function(err, result) {
            //call `done()` to release the client back to the pool
            done();
            //console.log(result);//DEV OUTPUT
            res.app.locals.helpers.errResultHandler(err, 'Item Added Successfully', res);
        }); // END QUERY
      }); // END CONNECT
}; //END MODULE
