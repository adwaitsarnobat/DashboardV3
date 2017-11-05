var express = require('express');
var http = require('http');
var path = require('path');
var ibmdb = require('ibm_db');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
//app.use(express.methodOverride());
//app.use(express.cookieParser('your secret here'));
//app.use(express.session());
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
var db2;
var hasConnect = false;
var cfenv = require("cfenv");
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var mydb;


// db////
var ibmdb = require('ibm_db');
 /* Host name:
dashdb-entry-yp-dal09-10.services.dal.bluemix.net
Port number:
50001
Database name:
BLUDB
User ID:
dash14883
Password:
 
6rJEV_wu3gA_
Version:
Compatible with DB2 for Linux, UNIX, and Windows, Version 11.1 or later
 
Table to refer : DASH14883. TIDATA13 */
var db2;
var hasConnect = false;

// Set VCAP environment variable to run program locally
process.env['VCAP_SERVICES'] = '{"dashDB": [ { "name": "BLUDB","label": "dashDB", "plan": "Entry", "credentials": {"port": 50000,"db": "BLUDB",  "username": "dash14883","host": "dashdb-entry-yp-dal09-10.services.dal.bluemix.net","https_url": "https://dashdb-entry-yp-dal09-10.services.dal.bluemix.net:8443","hostname": "dashdb-entry-yp-dal09-10.services.dal.bluemix.net","jdbcurl":"jdbc:db2://dashdb-entry-yp-dal09-10.services.dal.bluemix.net:50000/BLUDB","uri": "db2://dash14883:6rJEV_wu3gA_@dashdb-entry-yp-dal09-10.services.dal.bluemix.net:50000/BLUDB","password": "6rJEV_wu3gA_" } } ]}';



if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
	console.log("yeayayaaaaaaaaaaaaaaaaaaaaaa")
	if (env['dashDB']) {
        hasConnect = true;
		db2 = env['dashDB'][0].credentials;
	}
	
}

if ( hasConnect == false ) {

   db2 = {
        db: "BLUDB",
        hostname: "dashdb-entry-yp-dal09-10.services.dal.bluemix.net",
        port: 50000,
        username: "dash14883",
        password: "6rJEV_wu3gA_"
     };
}

var connString = "DRIVER={DB2};DATABASE=" + db2.db + ";UID=" + db2.username + ";PWD=" + db2.password + ";HOSTNAME=" + db2.hostname + ";port=" + db2.port;

//app.get('/con', routes.listSysTables(ibmdb,connString));
app.get('/con', function(req,res){
	       ibmdb.open(connString, function(err, conn) {
			if (err ) {
			 res.send("error occurred " + err.message);
			}
			else {
				conn.query("SELECT * from DASH14883.TIDATA13", function(err, tables, moreResultSets) {
							
							
				if ( !err ) { 
					console.log(tables);	
					res.send(tables);					
				} else {
				   res.send("error occurred " + err.message);
				}

				/*
					Close the connection to the database
					param 1: The callback function to execute on completion of close function.
				*/
				conn.close(function(){
					console.log("Connection Closed");
					});
				});
			}
		} );
});
// load local VCAP configuration  and service credentials
var vcapLocal;
try {
  vcapLocal = require('./vcap-local.json');
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) { }

const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}

const appEnv = cfenv.getAppEnv(appEnvOpts);

if (appEnv.services['cloudantNoSQLDB'] || appEnv.getService(/cloudant/)) {
  // Load the Cloudant library.
  var Cloudant = require('cloudant');

  // Initialize database with credentials
  if (appEnv.services['cloudantNoSQLDB']) {
     // CF service named 'cloudantNoSQLDB'
     var cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);
  } else {
     // user-provided service with 'cloudant' in its name
     var cloudant = Cloudant(appEnv.getService(/cloudant/).credentials);
  }

	
  //database name
  var dbName = 'mydb';

  // Create a new "mydb" database.
  cloudant.db.create(dbName, function(err, data) {
    if(!err) //err if database doesn't already exists
      console.log("Created database: " + dbName);
  });

  // Specify the database we are going to use (mydb)...
  mydb = cloudant.db.use(dbName);
}

//serve static file (index.html, images, css)
app.use(express.static(__dirname + '/views'));



var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});

