var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test');
//schema
var Schema = mongoose.Schema;
//schema structure
var userDataSchema = new Schema({
  name:{type: String, required: true},
  email: {type: String, required: true},
  password:{type: String, required: true}
},{collection: 'Register'});

var Register = mongoose.model('Register', userDataSchema);

module.exports.Register = Register;
