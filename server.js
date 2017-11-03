var express = require("express");
var app = express();
var cfenv = require("cfenv");
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var mydb;

/* Endpoint to greet and add a new visitor to database.
* Send a POST request to localhost:3000/api/visitors with body
* {
* 	"name": "Bob"
* }
*/
app.post("/api/visitors", function (request, response) {
	console.log("in")
  var userName = request.body.name;
  if(!mydb) {
    console.log("No database.");
    response.send("Hello " + userName + "!");
    return;
  }
  // insert the username as a document
  mydb.insert({ "name" : userName }, function(err, body, header) {
    if (err) {
      return console.log('[mydb.insert] ', err.message);
    }
    response.send("Hello " + userName + "! I added you to the database.");
  });
});

/**
 * Endpoint to get a JSON array of all the visitors in the database
 * REST API example:
 * <code>
 * GET http://localhost:3000/api/visitors
 * </code>
 *
 * Response:
 * [ "Bob", "Jane" ]
 * @return An array of all the visitor names
 */
app.get("/api/visitors", function (request, response) {
  var names = [];
  if(!mydb) {
    response.json(names);
    return;
  }

  mydb.list({ include_docs: true }, function(err, body) {
    if (!err) {
      body.rows.forEach(function(row) {
        if(row.doc.name)
          names.push(row.doc.name);
      });
      response.json(names);
    }
  });
});

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
//alert("inn")
/* To view your app, open this link in your browser: http://localhost:3000
{ Error: [IBM][CLI Driver] SQL30081N  A communication error has been detected. C
ommunication protocol being used: "TCP/IP".  Communication API being used: "SOCK
ETS".  Location where the error was detected: "169.44.98.126".  Communication fu
nction detecting the error: "recv".  Protocol specific error code(s): "10054", "
*", "0".  SQLSTATE=08001

    at Error (native)
  errors: [],
  error: '[node-odbc] SQL_ERROR',
  message: '[IBM][CLI Driver] SQL30081N  A communication error has been detected
. Communication protocol being used: "TCP/IP".  Communication API being used: "S
OCKETS".  Location where the error was detected: "169.44.98.126".  Communication
 function detecting the error: "recv".  Protocol specific error code(s): "10054"
, "*", "0".  SQLSTATE=08001\r\n',
  state: '08001' }
 */
ibmdb.open("DATABASE='BLUDB';HOSTNAME=dashdb-entry-yp-dal09-10.services.dal.bluemix.net;UID='dash14883';PWD='6rJEV_wu3gA_';PORT=50001;PROTOCOL=TCPIP", function (err,conn) {
  if (err) return console.log(err);
  
  conn.query('select * from DASH14883.TIDATA13', function (err, data) {
    if (err) console.log(err);
    else console.log(data);
 
    conn.close(function () {
      console.log('done');
    });
  });
});
  
// db////
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

