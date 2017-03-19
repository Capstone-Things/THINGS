/****************************************************
* /path     a/admin/tagitem/:id/:tag
* /params   :id - The id of the item to tag
*           :tag - the name of the tag to give the item
*
* /brief    Add a tag to an item given its id
*
* /author   Luke
* /date     2/7/2017
****************************************************/
module.exports = (req,res) => {
  //first query the database
  //then return the results to the user

      res.app.locals.pool.connect(function(err, client, done) {
        if(err) {
            console.error('error fetching client from pool', err);
            res.sendStatus(500);
        }
        client.query('INSERT INTO tags VALUES ($1, $2)',
                    [req.params.tag, req.params.id], function(err, result) {
          //call `done()` to release the client back to the pool
          done();

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
                res.app.locals.helpers.errResultHandler(err, null, res);
              }
          } // No error
          else {
            res.app.locals.helpers.errResultHandler(err, 'Tag Added Successfully', res);
          }
      });
    });
}
