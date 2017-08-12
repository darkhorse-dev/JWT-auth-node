			   JWT Authentication Using NodeJs and MongoDB
An API approach is an architectural approach that revolves around providing programmable interfaces to a set of services to different applications serving different types of consumers. One of the many challenges while working with API is authentication. In traditional web applications, the server responds to a successful authentication request by doing two things. First, it creates a session using some storage mechanism. Each session has its own identifier – usually a long, semi-random string – which is used to retrieve information about the session on future requests. Secondly, that information is sent to the client by way of headers instructing it to set a cookie. The browser automatically attaches the session ID cookie to all subsequent requests, allowing the server to identify the user by retrieving the appropriate session from storage. This is how traditional web applications get around the fact that HTTP is stateless. 
API designers can’t rely on cookies, as there is no guarantee that requests will be made via a web browser. Clearly, we need an alternative mechanism. Therefore, since few years, JWT has been ditching cookies for authentication. 


JWT (JSON Web Tokens) is described as “An open, industry standard RFC 7519 method for representing claims securely between two parties.” JSON (JavaScript Object Notation) is a lightweight data Interchangeable format many of us must be familiar with since it has taken over “XML based technique” by storm. JWT pronounced as “jot” makes use of JSON to transfer claim between the two parties.
JWT comprises of Header, payload and signature

					





When client logs into a server, he gets web tokens instead of cookies. The basic flow of whole authentication process of JWT can be explained in steps below:
1. Client Logs in - Email and password are validated, server encodes the User ID and payload against a secret and sends it to the clients.
2. Client gets the JWT- Client stores the JWT in the local storage and it has no idea of what's inside because it cannot decode since only the server can decode the JWT. Client just knows that “They are authenticated as long as it has valid JWT.”
3. Client restarts- No matter how many times the client restarts, it is still authenticated as long as it has valid JWT in the local storage, unless the JWT expires.
4. Client requests resource- Whenever client requests a resource, it will put JWT tokens in the request header. When server receives the request, it looks for JWT in the header, decodes it and upon knowing the validity of the client, sends the resource to the client.

Instead of supplying credentials such as a username and password with every request, we can allow the client to exchange valid credentials for a token. This token gives the client access to resources on the server.
How to use JWT authentication in Nodejs:
Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js' package ecosystem, npm, is the largest ecosystem of open source libraries in the world.
Make sure your MongoDB service is running. By running the command:
sudo mongod -- service start data
Install Nodejs and npm (node package manager). You can install nodejs using following command:
wget -qO- https://deb.nodesource.com/setup_6.x | sudo bash -
sudo apt-get install nodejs
Now to get latest version of Node Package Manager(NPM), we need to type following command:
sudo apt-get install npm
1. Install MongoDB if you dont have by following commands:
sudo apt­key adv ­­keyserver hkp://keyserver.ubuntu.com:80 ­­recv 7F0CEB10
2. echo 'deb http://downloads­distro.mongodb.org/repo/ubuntu­upstart dist 10gen' | sudo tee
/etc/apt/sources.list.d/mongodb.list
3. sudo apt­get update
4. sudo apt­get install mongodb­org

We highly recommend the use of “sublime text editor” to write your code. The directory structure for the application should be similar to the one shown below.
Add following Dependencies in package.json file:

```
#!javascript

"dependencies": {
    "body-parser": "^1.12.3",
    "express": "^4.0.1",
    "glob": "^5.0.15",
    "jasmine-node": "^1.14.5",
    "jsonwebtoken": "^5.0.1",
    "jwt-simple": "^0.5.0",
    "moment": "^2.14.1",
    "mongodb": "^2.1.7",
    "mongoose": "^4.2.2"
  }
```

In the terminal where “package.json” file is, type the command “npm install” and hit the enter. This will download the dependencies listed out in the package.json file and place them in folder node_module.
First of all we need to make the user schema. This is made in the User.js file. Following code shows the user schema:
 
```
#!javascript

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
```

mongoose.model('User', UserSchema);
In your userCtrl.js write following code:

```
#!javascript

// userCtrl.js file starts
var mongoose = require('mongoose');	// This an ORM between MongoDB and Node
var User = mongoose.model("User");	//Registering User schema 
var app= myApp.app;				
var moment = require('moment');		//  Using the added dependency
var jwt = require('jwt-simple');		// Using the added dependency	
app.set('jwtTokenSecret', 'NuospinTrainingVarsity');	// Can be anything
```

Now we will “register” the the incoming user with following code:

```
#!javascript

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
```

The above method, takes the HTTP request “req” and give HTTP response as in “res”. This method has been called with help of routes.js file which will be later discussed in this blog. The user is saved by using the “save” method.
Now we need to add code where our login request is handeled:

```
#!javascript

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
  var newToken= createToken(user,res);	//CreateToken Method Called
  });
};
```

In our immidiate above code, we have made a function “login” which takes HTTP request “req” and give HTTP response as in “res”. This method has been called with help of routes.js file which will be later discussed in this blog. Since, “login” method requires sending our sensitive information our the network, we have made it as POST fuction. Therefore variables “email” and “password” can be initialised with the help of request body parameters. Then we will run the “findOne” query of the MongoDb, which on the basis of email and password bring out the user's data.
Create Token Method
Upon authenticating a user for its userId and password, server should respond with a JWT token.     
This token is generated via following code:

```
#!javascript

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


```
Now how do we decode the token?  

```
#!javascript

exports.testing = function(req,res){
    var newDecodeToken = decodeToken(req,res);
    };
```



Now our decode token method

```
#!javascript

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
```


If the decoding process fails, the JWT simple package will throw an exception. If this happens, or if no token has been provided, we respond with the error message with status code “400” saying “Access token has been expired”.

```
#!javascript

if (decoded.exp <= Date.now()) {
  res.end('Access token has expired', 400);
}
```

If on decoding, it is found that the token is still valid, we can retrieve the user and attach it to the request object as shown below. 

```
#!javascript

User.findOne({ _id: decoded.iss }, function(err, user) {
  req.user = user;
  console.log("Token Decrypted. Authenticated to proceed.");
});
};
// useCtrl.js file ends
```

Now we need to define our “app.js” file. This file is the starting file of our node application. 
Firstly we need to add the database settings. 

```
#!javascript

var mongoose = require('mongoose');// MongoDB connection library
const config = require('../config/config');
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function() {
  throw new Error('Unable to connect to database at ' + config.db);
});
```

Adding the Schema files:

```
#!javascript

var glob = require('glob');
var models = glob.sync('./model/*.js');
models.forEach(function(model) {
  require(model);
});

```

Adding the express settings:

```
#!javascript

var bodyParser = require('body-parser');// parse HTTP requests
var express = require('express');// server middleware
var app = express();
exports.app =express(); // Added
var dir = __dirname;
dir  = dir.replace("/api","");
dir = dir+ "/frontend/app";
app.use(express.static(dir));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
```


Routing the request using the routes.js:

```
#!javascript

 const varIndexCtrl = require('./controller/indexCtrl');
 require('./routes')(app);

```

Adding the port number:
app.listen(9090, function() {
  console.log("Node server running on " + 9090);
});
At last we need to add the routes.js file:

```
#!javascript

module.exports = function(app){
const varUserCtrl = require('./controller/userCtrl');
app.post("/register",varUserCtrl.register);
app.post("/login",varUserCtrl.login);
app.post("/testing",varUserCtrl.testing);
};
```

To run the app.js file type the command “node app.js”. The console should display the following Message:
The Node Server Running on port 9090.
Now since we need to “register” the user first. On registering the user, our system creates the “JWT token”. For registering the user, we need to make the POST call. The POST call can be made by browser by making the forms and sending the data using request body OR we can use the “Postman”. Postman  is the plugin of google chrome which allows you to easily make HTTP requests. Installation of postman is easy as any other chrome plugin. Now for making the POST request, we can send the JSON data in following format:

```
#!javascript

{
"userId":"009",
  "mobilenNumber": "123",
  "password": "1234",
  "firstName": "rahul",
  "lastName": "rajput",
  "email":"rahul@nuospin.com",
  "gender" : "M"
  }
```

Remember to send the data in body tab and select the “content/type” as JSON. Also remember to select the POST  mehod  from the list of request methods adjacent to URL textbox. Now since our server is running on port 9090, and method we need to call is “register”, type following in your URL body:
http://localhost:9090/register 
The server will respond with the token and following information:

```
#!javascript

{
"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1N2QwZDRhYzBjZDk5NDRhMGMzMGNiYTgiLCJleHAiOjE0NzMzOTAxMjQ5NTd9.0HYV0ir_vIj-CJ6_jGiU-eoRRgED1kRUKJbDMrdP9us",
  "user": {
    "__v": 0,
    "userId": "009",
    "mobilenNumber": 123,
    "password": "1234",
    "firstName": "rahul",
    "lastName": "rajput",
    "email": "rahul@nuospin.com",
    "_id": "57d0d4ac0cd9944a0c30cba8",
    "gender": "M"
  }
}
```

Similarly you can call the “login” method by the follwing URL:
 http://localhost:9090/login 
Remember to send the userid and password only in request body for “login” method. 
Response will be given as shown in screenshot:

For decoding the token, we have made the method “decode”, which can be called by hitting the URL with  http://localhost:9090/decode and sending a token as JSON data, see the console in the case of running the ''decode” method as it does not responds with data. However you will see the message : 
Token Decrypted. Authenticated to proceed in case our token is valid.
Conclusion
JWTs are very light-weight and simple and there is no state-set like cookies, whether it is memory or database. There is no database lookup required as the payload is embedded in the request header it selves. Moreover, JWT implementations exist for Clojure, .NET (Public domain software), Go, Haskell, Python, Node.js, Java, JavaScript, Lua, PHP, Ruby, Rust, Scala, and Elixir. For full git code checkout https://bitbucket.org/diszrafale/jwt-authentication-using-node. 