module.exports = (req, res) => {

    const util = require('util');


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
 
         
          client.query('SELECT item_id, item_name, quantity, threshold  FROM all_items order by item_id', [], function(err, resultItems) {
               //call `done()` to release the client back to the pool
               //done();
                //const util = require('util');
                var newResult 

                console.log(util.inspect(resultItems, { showHidden: true, depth: 1 }));
                if(err) {
                    console.log("Item was not received properly", err);
                }

                else { //add tags 
                    console.log("Inside tags for loop");
                    i=0;
                    console.log("Inside tags for loop - i="+ i +"/ length="+resultItems.length);
                   client.query('SELECT item_id, tag_name FROM tags order by item_id' , [], function(err, resultTags) {
                        //call `done()` to release the client back to the pool
                        done();
                      
                        console.log('resulTags inspect');
                        console.log(util.inspect(resultTags.rows[0], { showHidden: true, depth: 1 }));
                       console.log('end ------------------------------resulTags inspect');
                        if(err) {
                            console.log("Tag name was not received properly", err);
                        }

                        else {
                            //add resultTags for this one item to the resultItems array

                            //resultItems.rows[i].push(resultTags);
                            //for (j=0; j < resultTags.rowCount; j++){
                                var items=[];
                                j=0;
                                for (i=0; i < resultItems.rowCount; i++){
                                    var itemTags = [];
                                    for (; j < resultTags.rowCount && resultItems.rows[i].item_id == resultTags.rows[j].item_id ; j++){
                                        itemTags.push(resultTags.rows[j].tag_name);
                                    }
                                    //if (resultItem.rows[i].item_id == resultTags.rows[j].item_id){
                                    //    resultItems.rows[i].tags.push({tags:resultTags.rows[j]});
                                    //}
                                    items.push({item_id: resultItems.rows[i].item_id,
                                                item_name: resultItems.rows[i].item_name,
                                                quantity: resultItems.rows[i].quantity,
                                                threshold: resultItems.rows[i].threshold,
                                                tags: itemTags});

                                }
                                //res.contentType('application/json');
                                //res.send(JSON.stringify(items));
                                console.log('Array items 0----');
                                // const util = require('util');
                              console.log(util.inspect(items[0], { showHidden: true, depth: 1 }));
 

                            //}
                            //resultItems.rows[i].push(resultTags);

                            //console.log("resultTags");

                            //const util = require('util');

                            console.log(util.inspect(resultItems, { showHidden: true, depth: 1 }));

                            //resultItems.rows.push(resultTags);
                        }           

//                        res.app.locals.helpers.errResultHandler(err, resultTags.rows, res);
                        }); /* end of Client query for getting tags*/
                    

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

