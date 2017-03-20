/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen

See LICENSE.txt for full information.
*/
/****************************************************
* /path     a/admin/checkin/:id/:person/:qty
* /params   id
*           person
*           qty
* /brief    Route to add quantity to an existing item in the inventory
****************************************************/
module.exports = (req, res) =>{

  // If the value to checkin is negative
  if (req.params.qty < 0) {
    // Respond with forbidden (403) status
    res.status(403);
    res.jsonp("ERROR: You cannot checkin a negative value. Operation canceled.");
  } else {

    res.app.locals.helpers.transaction(req.params.id, req.params.person, req.params.qty,
      req.app.locals.helpers.errResultHandler, res);
  }
};
