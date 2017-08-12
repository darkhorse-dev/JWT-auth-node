var myApp = require('../app'); // Added
var mongoose = require('mongoose');
var User = mongoose.model("User");
var app= myApp.app;
var moment = require('moment');
var jwt = require('jwt-simple');
app.set('jwtTokenSecret', 'NuospinTrainingVarsity');

exports.register =function(req,res){
var newUser = new User(req.body);
      newUser.save(function(err,user){
        if(err){
      console.log("error",err);
    }
    else{
      console.log("Registered");
      var newToken= createToken(user,res);
    }

      });
};


exports.login = function(req,res){

  var email = req.body.email;
  var password = req.body.password;

  User.findOne({email: email, password:password}, function(err, user){
    if(err){
      console.log(err);
    }

    if(!user){
      console.log("Not authenticated");
    }

  console.log("authenticated. Logged In");
  var newToken= createToken(user,res);
 // res.json(user);
  });
};

//**********************
var createToken= function(user,res){
var expires = moment().add('days', 1).valueOf();
var token = jwt.encode({
  iss: user.id,
  exp: expires
}, app.get('jwtTokenSecret'));
res.json({
  token : token,
  user
});

};
//**************************

var decodeToken = function(req,res){

var token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers['x-access-token'];
if (token) {
  try {
    var decoded = jwt.decode(token, app.get('jwtTokenSecret'));
    console.log("Decoded Token "+decoded);
    // handle token here
} catch (err) {
    console.log("Not authenticated --1");
  }
} else {
  console.log("Not authenticated--2");
}

if (decoded.exp <= Date.now()) {
  res.end('Access token has expired', 400);
}

User.findOne({ _id: decoded.iss }, function(err, user) {
  req.user = user;
  console.log("Token Decrypted. Authenticated to proceed.");
});

};

exports.decode = function(req,res){

    var newDecodeToken = decodeToken(req,res);

    };
//.............................................


