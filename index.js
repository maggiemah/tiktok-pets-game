// index.js
// This is our main server file
"use strict"

// A static server using Node and Express
const express = require("express");
// get Promise-based interface to sqlite3
const db = require('./sqlWrap');
// create object to interface with express
const app = express();
// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');

// * Code in this section sets up an express pipeline *
// gets text out of the HTTP body and into req.body; again not needed in this example
app.use(bodyParser.text());

// print info about incoming HTTP request for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})

// make all the files in 'public' available 
app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/tiktokpets.html");
});

// end of pipeline specification
app.post('/videoData', function(req, res, next) {
  console.log("got Post from", req.url);
  let data = req.body;
  console.log(data); 
  res.send(data);
});

// Need to add response if page not found!
app.use(function(req, res) { 
  res.status(404); 
  res.type('txt'); 
  res.send('404 - File '+req.url+' not found'); 
});

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});
