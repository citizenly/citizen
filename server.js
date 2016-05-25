var express = require('express');
var app = express();
var cors = require('cors');
var request = require('request');
var RepAPI = require('./src/js/helperFunctions/RepAPI.js');
var getRepName = RepAPI.getRepName;
var getRepInfo = RepAPI.getRepInfo;
var getPercentageVote = RepAPI.getPercentageVote;
var bodyParser = require("body-parser");
 
var whitelist = ['https://citizen-marie-evegauthier.c9users.io/'];
var corsOptionsDelegate = function(req, callback){
  var corsOptions;
  if(whitelist.indexOf(req.header('Origin')) !== -1){
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response 
  } else {
    corsOptions = { origin: false }; // disable CORS for this request 
  }
  callback(null, corsOptions); // callback expects two parameters: error and options 
};
 

/* this says: serve all the files in the src directory if they match the URL. Eg , if the client requests http://server/css/app.css then the file in src/css/app.css will be served. But if the client requests http://server/step-2 then since there is no file by that name the middleware will call next() */
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());


/* insert any app.get or app.post you need here. only if you do the advanced part */
// New AJAX call to the rep name for the url
app.post('/repnameget', function(req, res) {
  getRepName(req.body.postalcode, function(nameFormatted) {
    res.send(nameFormatted);
  });
});


//AJAX call to get the Rep object and make it available to the frontend
app.post('/repinfoget', function(req, res) {
  getRepInfo(req.body.repName, function(rep) {
    getPercentageVote(rep.ridingId, function(percentageVote) {
      rep.electedVote = percentageVote;
      res.send(rep);
    });
  });
});


/* This says: for any path NOT served by the middleware above, send the file called index.html instead. Eg, if the client requests http://server/step-2 the server will send the file index.html. Then on the browser, React Router will load the appropriate component */
app.get('/*', cors(corsOptionsDelegate),  function(request, response, next) {
  response.sendFile(__dirname + '/public/index.html');
});
app.listen(process.env.PORT || 8080, function() {
  console.log('server started');
});