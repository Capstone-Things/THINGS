/****************************************************
* /route    /secretdelete/:table/:id
* /params   :table - Table to delete from
*           :id - item_id
*
* /brief    Secret delete function for use during dev
*           Either never document, or remove prior to
*           delivery
*
* /author     Andrew McCann
* /date       2/10/2017
****************************************************/
module.exports = (req,res)=>{
  res.app.locals.pool.connect(function(err, client, done) {
      if(err) {
          return console.error('Error fetching client from pool', err);
      }
      var id = parseInt(req.params.id)
      if(id != req.params.id) {
          done();
          return console.error('Invalid item ID', err);
      }
      client.query('DELETE FROM $2 WHERE item_id = $1', [id, req.params.table], function(err, result) {
          done();
          res.app.locals.helpers.errResultHandler(err, result.rows, res);
      });
  });

}
