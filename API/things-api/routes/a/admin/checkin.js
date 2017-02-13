/****************************************************
* /path     /checkin/:id/:person/:qty
* /params   id
*           person
*           qty
* /brief    Route to add quantity to an existing item in the inventory
*
* /author   Luke
****************************************************/
module.exports = (req, res) =>{
    res.app.locals.helpers.transaction(req.params.id, req.params.person, req.params.qty,
      req.app.locals.helpers.errResultHandler, res);
};
