// index.js
// This is our main server file
"use strict"

// A static server using Node and Express
const express = require("express");

// Promises-wrapped version of sqlite3
const db = require('./sqlWrap');
// our database operations
const dbo = require('./databaseOps');

// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');
const { delete_all } = require("./databaseOps");

// create object to interface with express
const app = express();

// Code in this section sets up an express pipeline

// gets text out of the HTTP body and into req.body
app.use(bodyParser.text());

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})

// make all the files in 'public' available 
app.use(express.static("public"));

// a module to use instead of older body-parser
app.use(express.json());

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/myvideos/myvideos.html");
});

app.get("/getMostRecent", (request, response) => {
  dbo.get_most_recent()
    .then(function(data) {
      console.log(data);
      response.json(data);
    })
    .catch(function(error) {
      console.log("Error occurred:", error)
    });
});

app.get("/getList", (request, response) => {
  dbo.get_all()
    .then(function(data) {
      // console.log(data);
      response.json(data);
    })
    .catch(function(error) {
      console.log("Error occurred:", error)
    });
});

app.post('/deleteVideo', function(req, res, next) {
  console.log("got Post from ", req.url);
  let info = req.body;
  console.log(info);
  dbo.delete_video(info.nickname) //<<< insert video nickname here 
    .then(function(data) {
      // data = what is sent from post in index.js
      res.json("all good");
    })
    .catch(function(error) {
      console.log("Error occurred:", error)
    });
});

// end of pipeline specification
//
app.post('/videoData', function(req, res, next) {
  console.log("got Post from ", req.url);
  let info = req.body;
  console.log(info);

  dbo.get_count()
    .then(function(data) {
      // data = what is sent from post in index.js
      console.log("Count data: " + data);
      if(data >= 8) {
        res.json("database full");
      }
      else {
        dbo.post_video(info.url.trim(), info.nickname.trim(), info.userid.trim())
        res.json(info);
      }
    })
    .catch(function(error) {
      console.log("Error occurred:", error)
    });
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

/*
// call the async test function for the database
// this fills the db with test data
dbo.testDB().catch(
  function (error) {
    console.log("error:",error);
  }
);
*/