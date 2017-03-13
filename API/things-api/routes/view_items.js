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
    //SELECT item_id, item_name AS name, description, quantity FROM items

        req.app.locals.pool.connect(function(err, client, done) {
          if(err) {
              return console.error('error fetching client from pool', err);
          }
 
         
          client.query('SELECT tag_name FROM tags t, all_items a WHERE t.item_id = a.item_id', [], function(err, result) {
               //call `done()` to release the client back to the pool
               done();

                if(err) {
                    console.log("iTEM was not received properly", err);
                }

                else {
                        client.query('SELECT tag_name FROM tags t, all_items a WHERE t.item_id = a.item_id', [], function(err, result) {
                            //call `done()` to release the client back to the pool
                            done();

                            if(err) {
                                console.log("Tag name was not received properly", err);
                            }

                            else {
                                //add resultTags for this one item to the resultItems array

		                        resultItems.rows[i].push(resultTags);
                            }           

                            res.app.locals.helpers.errResultHandler(err, result.rows, res);
                        }); /* end of Client query for getting tags*/
                    
                }

                res.app.locals.helpers.errResultHandler(err, result.rows, res);
          });
        });
    
}
