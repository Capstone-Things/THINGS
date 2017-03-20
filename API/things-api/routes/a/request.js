
//note: nodemailer code comes from samples on https://nodemailer.com/about/

var time = require('node-datetime');


/****************************************************
* Path: /request.js
* HTTP Method: POST
* Params: itemName, quantityNeeded, personName, email, date, description, message
* Brief: This route will package up info from a user and e-mail it to a CAT admin
*
* Author: Austen Ruzicka
****************************************************/
module.exports = (req, res) => {

  var name = req.body.itemName;
  var num = req.body.quantityNeeded;
  var desc = req.body.description;
  var msg = req.body.message;
  var person = req.body.personName;
  var addr = req.body.email;
  var date = req.body.date;
  var datetime = time.create();
  var timereq = datetime.format('m/d/Y H:M:S');

  //console.log(req);//DEV LOG
  //console.log(req.body);//DEV LOG


// setup email data with unicode symbols
res.app.locals.mailOptions.subject = 'New Inventory Request from a User'; // Subject line

res.app.locals.mailOptions.html =  res.app.locals.mailOptions.html
  + 'A user named ' + person + ' has requested '
  + num + ' ' + name + ' <br>which is needed by ' + date
  + '. <br>This request was sent on ' + timereq + '<br>'
  + 'With the following description: ' + desc + '<br>'
  + 'Additional Information from user: ' + msg + '<br>' + 'To contact '
  + person + ' send an email to ' + addr + '<br>';


res.app.locals.smtpTransport.sendMail(res.app.locals.mailOptions, function(error, response){
        if(error){
          console.log(error);
          res.end("error");
        }
        else{
          console.log("Message sent: " + response.message);
          res.end("sent");
        }
      });
};
