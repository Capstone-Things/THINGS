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
 
         
          client.query('SELECT item_id, item_name, quantity, threshold  FROM all_items', [], function(err, resultItems) {
               //call `done()` to release the client back to the pool
               //done();
                const util = require('util');
                var newResult 

                console.log(util.inspect(resultItems, { showHidden: true, depth: 1 }));
                if(err) {
                    console.log("Item was not received properly", err);
                }

                else { //add tags 
                    console.log("Inside tags for loop");
                    i=0;
                    console.log("Inside tags for loop - i="+ i +"/ length="+resultItems.length);
                    for (i=0; i < resultItems.rowCount ; i++) {

                        console.log("Inside tags - loop ");
                        client.query('SELECT item_id, tag_name FROM tags' , [], function(err, resultTags) {
                            //call `done()` to release the client back to the pool
                            done();

                            if(err) {
                                console.log("Tag name was not received properly", err);
                            }

                            else {
                                //add resultTags for this one item to the resultItems array

		                        //resultItems.rows[i].push(resultTags);
                                for (j=0; j < resultTags.rowCount; j++){
                                    resultItems.rows[i].tags.push(resultTags.rows[j]);
                                }
                                //resultItems.rows[i].push(resultTags);

                                //console.log("resultTags");

                                const util = require('util');

                                console.log(util.inspect(resultItems, { showHidden: true, depth: 1 }));

                                //resultItems.rows.push(resultTags);
                            }           

                            res.app.locals.helpers.errResultHandler(err, resultTags.rows, res);
                        }); /* end of Client query for getting tags*/
                    
                } //end of adding tags for loop
                for(i = 0; i < resultItems.length; i++) {
                    console.log("ResultItems array:");
                    console.log(resultItems.rows[i]);
                    //console.log(resultItems.rows[i].item_id);
                    //console.log(resultItems.rows[i].resultTags);

                }
                res.app.locals.helpers.errResultHandler(err, resultItems.rows, res);
            } //end of success of first SQL query (resultItems)
          });
        });
    
    
}

function item(id, name, qty, thresh, tags) {
    this.item_id = id;
    this.item_name = name;
    this.quantity = qty;
    this.threshold = thresh;
    this.tags = tags;
}