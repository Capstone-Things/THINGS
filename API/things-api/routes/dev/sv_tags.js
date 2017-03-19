module.exports = (req,res)=>{
  res.app.locals.pool.connect(function(err, client, done) {
      if(err) {
         console.error('Error fetching client from pool', err);
         res.sendStatus(500);
      }
      client.query('SELECT * FROM tags', [], function(err, result) {
          done();
          res.app.locals.helpers.errResultHandler(err, result.rows, res);
      });

  });
}
