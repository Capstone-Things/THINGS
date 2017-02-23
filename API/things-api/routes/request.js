var nodemailer = require('nodemailer');

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

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: 'yahoo',
  auth: {
      user: 'catthingsuser@yahoo.com',
      pass: 'testing12345'
  }
});

// setup email data with unicode symbols
let mailOptions = {
  from: '"CAT-Things-User" <catthingsuser@yahoo.com>', // sender address
  to: 'catthingsuser@yahoo.com', // list of receivers
  subject: 'New Inventory Request from a User', // Subject line
  text: 'A user named ' + person + ' has requested ' + num + ' ' + name + ' which is needed by ' + date + '\n' + 'With the following description: ' + desc + '\n' + 'Additional Information from user: ' + msg + '\n' + 'To contact ' + person + ' send an email to ' + addr + '\n'
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
      return console.log(error);
  }
  console.log('Message %s sent: %s', info.messageId, info.response);
  res.sendStatus(200);//send 200 response code.
});

};
