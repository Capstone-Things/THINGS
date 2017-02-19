//this  is a temporary script not intended for distribution in the final product.
//this is a workaround untill a create user module can be created.
//It can be called with node passwordHasher.js <passwordToHash>
//the hash of the password will be printed and you may store it in the database
//manually.

var bcrypt = require('bcrypt-nodejs');

var pass = process.argv[2];
var hash = bcrypt.hashSync(pass);

console.log(`raw password: ${process.argv[2]} , hash: ${hash}`);
