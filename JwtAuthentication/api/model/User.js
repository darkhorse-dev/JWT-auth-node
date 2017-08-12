var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var UserSchema = new Schema({
  "userId": { type: String, trim: true, required: false },
  "mobilenNumber": { type: Number, required: false},
  "password": { type: String, trim: true, required: true },
  "firstName": { type: String, trim: true, required: true },
  "lastName": { type: String, trim: true, required: false },
  "email":{type:String,trim:true,required:true},
  "gender" : { type: String, default:'M', enum: ['M', 'F'] },
});

mongoose.model('User', UserSchema);
