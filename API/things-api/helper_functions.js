//helper_functions.js Exports a number of funtions that are used in various
// templates.  by locating the functions here, functions from different
// directories can gain access after we attatch this object to the app.locals variable

module.exports = {
  /****************************************************
  * /func name  errResultHandler
  * /params     :err - the error that occured, null if none
  *             :result - the result of the database query
                        (either the rows returned or success message)
                :res - the function to handle the responding the result
  *
  * /brief      Responds with a meaningful status and returns the results
  *
  * /author     Luke
  * /date       2/7/2017
  ****************************************************/


  errResultHandler: function(err, result, res) {


      if (err) {

        res.status(500); 
        res.jsonp('Database Error');


        var errString = '';
        var statusInt = 500;
        if(err.routine == 'pg_atoi') {
          errString = "ERROR: An integer field contained an invalid integer.";
          statusInt = 400; //Bad request
        } else if(err.routine == 'cash_in') {
          errString = "ERROR: An money field contained an invalid value.";
          statusInt = 400; //Bad request
        } else {
          errString = 'Database Error';
        }

        console.error(errString);

        res.status(statusInt);
        res.jsonp(errString);
        

      } else {

        res.status(200);
        res.jsonp(result);
        
      }
  },


/****************************************************
  * /func name  Email Initialization
  * /params     :err - the error that occured, null if none
  *             :result - the result of the database query
                        (either the rows returned or success message)
                :res - the function to handle the responding the result
  *
  * /brief      Initializes email information such as sender, receiver, subject, etc. 
  *
  * /author     Susmita Awasthi
  * /date       3/5/2017
  ****************************************************/
/*
 var: mailOptions = {

   from: res.app.locals.mailopt.mail.from,
   to: res.app.locals.mailopt.mail.to,
    //from: '"Susmita Awasthi" <susmita.awasthi@gmail.com>', // sender address
    //to: 'Susmita PSU, <susmita@pdx.edu>', // list of receivers
    subject: 'CATTHINGS Notice: Item Below Threshold', // Subject line
    text: "", // plain text body
    html: '<b></b>' // html body
},
*/

//app.locals.mailOptions.subject = 'CATTHINGS Notice: Item Below Threshold'; // Subject line
//app.locals.mailOptions.text = "";

  /****************************************************
  * /func name  transaction
  * /brief      Helper function for checkin route
  *
  * /author     Luke 
  ****************************************************/
  transaction: function(id, person, qty, retFunc, res) {

      res.app.locals.pool.connect(function(err, client, done) {
          if(err) {
              return console.error('error fetching client from pool', err);
          }
           client.query('INSERT INTO transactions(item_id, person, qty_changed) VALUES ($1, $2, $3)', [id, person, qty], function(err, result) {
              //call `done()` to release the client back to the pool
              done();

              if(err) {
                // If the error is because they checked out too many items,
                if (err.toString().includes("items_quantity_check")) {
                  // Respond with conflict (409) status
                  res.status(409);
                  res.jsonp("ERROR: Transaction not completed because it would result in an item with a negative quantity.");
                } else {
        
                  retFunc(err, null, res);
                  
                }
              } else {
                  retFunc(null, 'transaction: Transaction Completed Successfully', res);
                
              }
          });
      });
  

},


/****************************************************
  * /func name  doThresholdCheck
  * /params     :id - the id of the user
  *             :retFunc - The Error Result Handler
                :res - the function to handle the responding the result
  *
  * /brief      Checks the threshold of the item being checked out
  *
  * /author     Susmita Awasthi
  * /date       3/5/2017
  ****************************************************/

  doThresholdCheck: function(id, qty, retFunc, res) {

    res.app.locals.pool.connect(function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT threshold, quantity, item_name, item_id from items where item_id = $1', [id], function(err, result) {
    done();
    if(err) {
      console.error('Threshold and quantity were not received properly', err);
    }
    else {
      if((result.rows[0].quantity - qty) <= result.rows[0].threshold) { //send email to administrator
        console.log("Sending email to administrator: ");
        app.locals.mailOptions.subject = 'CATTHINGS Notice: Item Below Threshold'; // Subject line
        app.locals.mailOptions.text = "";

        app.locals.mailOptions.html =  app.locals.mailOptions.html 
        + "This is to inform you that the following item is at or below its threshold level in the THINGS inventory. "
        + "The details of the item are: " + "<br>" + "<br>" 
        + "Item ID: " + result.rows[0].item_id + "<br>"
        + "Item Name: " + result.rows[0].item_name + "<br>"
        + "Item Threshold: " + result.rows[0].threshold + "<br>"
        + "Quantity Remaining: " + (result.rows[0].quantity - qty) + "<br>" + "<br>" + "<br>"
        + "Thank you, " + "<br>" + "<br>" + "<br>" 
        + "    CATTHINGS";

        res.app.locals.smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
          console.log(error);
          res.end("error");
        }
        else{
          console.log("Message sent: " + response.message);
          res.end("sent");
        }
      });
     }
    }
   });
  });
 }
}
