'use strict';
module.exports = function(app){

const varIndexCtrl = require('./controller/indexCtrl');
const varUserCtrl = require('./controller/userCtrl');

app.get("/", varIndexCtrl);
app.post("/register",varUserCtrl.register);
app.post("/login",varUserCtrl.login);
app.post("/decode",varUserCtrl.decode);
};
