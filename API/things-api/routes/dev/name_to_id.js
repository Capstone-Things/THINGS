module.exports = (req, res) => {
    res.app.locals.pool.connect(function(err, client, done) {
        if(err) {
            return console.error('Error fetching client from pool', err);
        }
        // Add some fuzziness to the param name
        var param = '%' + req.params.name + '%'
        client.query('SELECT item_id, item_name FROM items WHERE item_name LIKE lower($1)', [param], function(err, result) {
            done();
            res.app.locals.helpers.errResultHandler(err, result.rows, res);
        });
    });
}
