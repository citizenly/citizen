var express = require('express');
var app = express();
var cors = require('cors');
var request = require('request');
var RepAPI = require('./src/js/helperFunctions/repAPI.js');
var getRepName = RepAPI.getRepName;
var getRepInfo = RepAPI.getRepInfo;
var getPercentageVote = RepAPI.getPercentageVote;
var bodyParser = require("body-parser");
var BillsAPI = require('./src/js/helperFunctions/billsAPI.js');
var fixLimitByPage = BillsAPI.fixLimitByPage;
var getAllVotes = BillsAPI.getAllVotes;
var getListofBillsFromVotes = BillsAPI.getListofBillsFromVotes;
var getUniqueBillsByDate = BillsAPI.getUniqueBillsByDate;
var getTitleOfBill = BillsAPI.getTitleOfBill;
var getListOfBillsWithTitle = BillsAPI.getListOfBillsWithTitle;
var filterUniqueBillsByResult = BillsAPI.filterUniqueBillsByResult;
var getAllBills = BillsAPI.getAllBills;
var allBills = BillsAPI.allBills;
 
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

/* REP FUNCTION CALLS ------------------------------------------------------- */
/* insert any app.get or app.post you need here. */
// New AJAX call to the rep name for the url
app.post('/repnameget', function(req, res) {
  getRepName(req.body.postalcode, function(nameFormatted) {
    if(nameFormatted === "Sorry, this is not a valid Canadian postal code") {
      res.redirect('/');  
    }
    else {
      res.send(nameFormatted);
    }
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
/* -------------------------------------------------------------------------- */

/* BILLS FUNCTION CALLS ------------------------------------------------------- */
app.post('/postfilter', function(req, res) {
  req = req.body.filter;
  console.log(req, 'req');
  switch (req) {
    case 'active':
      fixLimitByPage(function(limit) {
        getAllVotes(limit, function(arrOfVotes) {
          getListofBillsFromVotes(arrOfVotes, function(bills) {
            getTitleOfBill(function(billsWithTitle) {
              getListOfBillsWithTitle(bills, billsWithTitle, function(listOfBillsWithTitle) {
                getUniqueBillsByDate(listOfBillsWithTitle, function(listOfUniqueBills) {
                  res.send(listOfUniqueBills);
                });
              });
            });
          });
        });
      });
      break;
      
    case 'passed':
    case 'failed':
      fixLimitByPage(function(limit) {
        getAllVotes(limit, function(arrOfVotes) {
          getListofBillsFromVotes(arrOfVotes, function(bills) {
            getTitleOfBill(function(billsWithTitle){
              getListOfBillsWithTitle(bills, billsWithTitle, function(listOfBillsWithTitle){
                getUniqueBillsByDate(listOfBillsWithTitle, function(listOfUniqueBills){
                  filterUniqueBillsByResult(listOfUniqueBills, req, function(listOfUniqueBillsByResult) {
                    res.send(listOfUniqueBillsByResult);
                  });
                });
              });
            });
          });
        });
      });  
      break;
      
    case 'all':
      fixLimitByPage(function(limit) {
        getAllBills(limit, function(arrOfBills) {
          allBills(arrOfBills, function(allBills) {
            res.send(allBills);
          });
        });
      });
      break;  
      
    default:
      res.send([]);
  }
});
/* -------------------------------------------------------------------------- */


/* This says: for any path NOT served by the middleware above, send the file called index.html instead. Eg, if the client requests http://server/step-2 the server will send the file index.html. Then on the browser, React Router will load the appropriate component */
app.get('/*', cors(corsOptionsDelegate),  function(request, response, next) {
  response.sendFile(__dirname + '/public/index.html');
});
app.listen(process.env.PORT || 8080, function() {
  console.log('server started');
});