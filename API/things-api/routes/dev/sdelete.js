/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen

See LICENSE.txt for full information.
*/
/****************************************************
* /route    /secretdelete/:table/:id
* /params   :table - Table to delete from
*           :id - item_id
*
* /brief    Secret delete function for use during dev
*           Either never document, or remove prior to
*           delivery
****************************************************/
module.exports = (req,res)=>{
  res.app.locals.pool.connect(function(err, client, done) {
      if(err) {
          console.error('Error fetching client from pool', err);
          res.sendStatus(500);
      }
      var id = parseInt(req.params.id)
      if(id != req.params.id) {
          done();
          console.error('Invalid item ID', err);
          res.sendStatus(400);
      }
      client.query('DELETE FROM $2 WHERE item_id = $1', [id, req.params.table], function(err, result) {
          done();
          res.app.locals.helpers.errResultHandler(err, result.rows, res);
      });
  });

}
