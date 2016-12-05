var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imagen_schema = new Schema({
  title:{type:String, required: true}
});

var imagen = mongoose.model("imagen", imagen_schema);

module.exports = imagen;
