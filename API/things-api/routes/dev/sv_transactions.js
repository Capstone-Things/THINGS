module.exports = (req,res)=>{
  res.app.locals.pool.connect(function(err, client, done) {
      if(err) {
          return console.error('Error fetching client from pool', err);
      }
      client.query('SELECT * FROM transactions', [], function(err, result) {
          done();
          res.app.locals.helpers.errResultHandler(err, result.rows, res);
      });

  });
}
