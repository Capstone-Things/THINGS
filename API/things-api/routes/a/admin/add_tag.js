/****************************************************
* /path     /tagitem/:id/:tag
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
            return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO tags VALUES ($1, $2)',
                    [req.params.tag, req.params.id], function(err, result) {
            //call `done()` to release the client back to the pool
            done();
            res.app.locals.helpers.errResultHandler(err, 'Tag Added Successfully', res);
        });
    });
}
