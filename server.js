var express = require('express'),
  config = require('./server/configure'),
  app = express(),
  mongoose = require('mongoose');

var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

if (typeof ipaddress === "undefined") {
  //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
  //  allows us to run/test the app locally.
  console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
  ipaddress = 'localhost';
};

app.set('appName', 'RCI');
app.set('port', port);
app.set('ipaddr', ipaddress);
app.set('views', __dirname + '/public');
app = config(app);

var connectionString = 'mongodb://localhost/RCI';
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    process.env.OPENSHIFT_APP_NAME;
}

mongoose.connect(connectionString);
mongoose.connection.on('open', function(err) {
  if (err) { throw err; }
  else { console.log('Mongoose connected: ' + connectionString) };
});

var server = app.listen(app.get('port'), app.get('ipaddr'), function() {
  console.log('Server up: http://'+app.get('ipaddr')+':' + app.get('port'));
});
