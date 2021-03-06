/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen

See LICENSE.txt for full information.
*/
module.exports = (req, res) => {

    var items = [];


  /****************************************************
  * /path     /view
  * /params   null
  * /brief    Display all entries in the items table
  ****************************************************/
    //first query the database
    //then return the results to the user

    req.app.locals.pool.connect(function(err, client, done) {
        if(err) {
            console.error('error fetching client from pool', err);
            res.sendStatus(500);
        }


    client.query('SELECT item_id, item_name, quantity, threshold, price, description FROM all_items WHERE is_hidden = false ORDER by item_id', [], function(err, resultItems) {
        //call `done()` to release the client back to the pool
        //done();

        if(err) {
            console.log("Item was not received properly", err);
        }

        else { //add tags
            i=0;
            client.query('SELECT item_id, tag_name FROM tags order by item_id' , [], function(err, resultTags) {
            //call `done()` to release the client back to the pool
            done();

                if(err) {
                    console.log("Tag name was not received properly", err);
                }

                else {
                //add resultTags for this one item to the resultItems array

                    j=0;
                    for (i=0; i < resultItems.rowCount; i++){
                        var itemTags = [];
                        for (; j < resultTags.rowCount && resultItems.rows[i].item_id == resultTags.rows[j].item_id ; j++){
                            itemTags.push(resultTags.rows[j].tag_name);
                        }

                        items.push({item_id: resultItems.rows[i].item_id,
                                    name: resultItems.rows[i].item_name,
                                    description: resultItems.rows[i].description,
                                    quantity: resultItems.rows[i].quantity,
                                    threshold: resultItems.rows[i].threshold,
                                    price: resultItems.rows[i].price,
                                    tags: itemTags});
                        }
                    }

                    res.app.locals.helpers.errResultHandler(err, items, res);
                }); /* end of Client query for getting tags*/
            } //end of success of first SQL query (resultItems)
        }); //End of SELECT first query
    }); //end of pools.connect
}//end of module
