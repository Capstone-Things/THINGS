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
  //parse the tags
  console.log(req.params.tags);
  var tags = req.params.tags.split(',')
  console.log(tags);

      res.app.locals.pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO items(item_name, description, price, threshold) VALUES ($1, $2, $3, $4)',
        [req.params.name, req.params.desc, req.params.price, req.params.thresh], function(err, result) {
            //call `done()` to release the client back to the pool
            console.log(result);
            console.log(result.rows[0]);
          //  res.app.locals.helpers.errResultHandler(err, 'Item Added Successfully', res);
        });

        //figure out the item id of our newly inserted item
        client.query('SELECT max(item_id) FROM all_items',[], function(err, result) {
           console.log(result.rows[0]);
           console.log(result.rows[0].max);
           itemID = result.rows[0].max;

           for(i=0; i<tags.length; i++){
             //build up the string of tags to insert
             values += `INSERT INTO tags (tag_name, item_id) VALUES ("${tags[i]}", "${itemID}"); `
           }// END FOR
           console.log(values);
        });



        //loop through the list of tags, and insert each into the database



          client.query(values, function(err, result) {
            if (err) {
                // If the item id to add the tag to does not exist
                if (err.toString().includes("violates foreign key constraint")) {
                  res.status(400);
                  res.jsonp("ERROR: No item exist with that id. You can only add tags to items that exist in the database.");

                } // If this item already has this tag
                else if (err.toString().includes("duplicate key value violates unique constraint")) {
                  res.status(400);
                  res.jsonp("ERROR: A tag with that name already exists for that item. An item cannot have duplicate tags.");
                } else {
                  //res.app.locals.helpers.errResultHandler(err, null, res);
                }
            } // No error
            else {

              console.log(result);
            //  res.app.locals.helpers.errResultHandler(err, 'Tag Added Successfully', res);
            }
      });


    client.query('INSERT INTO transactions(item_id, person, qty_changed) VALUES ($1, $2, $3)', [itemID, req.params.user, req.params.qty], function(err, result) {
       //call `done()` to release the client back to the pool
       done();

       if(err) {
         console.log(err)
         // If the error is because they checked out too many items,
         if (err.toString().includes("items_quantity_check")) {
           // Respond with conflict (409) status
           res.status(409);
           res.jsonp("ERROR: Transaction not completed because it would result in an item with a negative quantity.");
         } else {
           //console.error('error running query', err);
           res.app.locals.helpers.errResultHandler(err, null, res);
         }
       } else {
           console.log(result)
           res.app.locals.helpers.errResultHandler(null, 'Transaction Completed Successfully', res);
       }
   });

    //return the client to the pool;
    });
    //submit initial qty insert


};
