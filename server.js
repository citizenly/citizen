var express = require('express');
var app = express();
var fs = require('fs');
var cheerio = require('cheerio');
var $ = require('jquery');
var cors = require('cors');
var request = require('request');
var ParseServer = require('parse-server').ParseServer;
var RepAPI = require('./src/js/helperFunctions/repAPI.js');
var getRepName = RepAPI.getRepName;
var getRepInfo = RepAPI.getRepInfo;
var getPercentageVote = RepAPI.getPercentageVote;
var bodyParser = require("body-parser");
var BillsAPI = require('./src/js/helperFunctions/billsAPI.js');
var fixLimitByPage = BillsAPI.fixLimitByPage;
var getAllVotes = BillsAPI.getAllVotes;
var getListOfBillsFromVotes = BillsAPI.getListOfBillsFromVotes;
var getUniqueBillsByDate = BillsAPI.getUniqueBillsByDate;
var getTitleOfBill = BillsAPI.getTitleOfBill;
var getListOfBillsWithTitle = BillsAPI.getListOfBillsWithTitle;
var filterUniqueBillsByResult = BillsAPI.filterUniqueBillsByResult;
var getAllBills = BillsAPI.getAllBills;
var allBills = BillsAPI.allBills;
var getBallotsByPolitician = BillsAPI.getBallotsByPolitician;
var getBallotsAboutBillWithTitle = BillsAPI.getBallotsAboutBillWithTitle
var getBillBySponsor = BillsAPI.getBillBySponsor;
var getUltimateVotedFromBillId = BillsAPI.getUltimateVotedFromBillId;

var whitelist = ['https://citizen-iblameyourmother.c9users.io/'];
var corsOptionsDelegate = function(req, callback){
  var corsOptions;
  if(whitelist.indexOf(req.header('Origin')) !== -1){
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response 
  } else {
    corsOptions = { origin: false }; // disable CORS for this request 
  }
  callback(null, corsOptions); // callback expects two parameters: error and options 
};
 
var api = new ParseServer({
  databaseURI: 'mongodb://localhost:27017/dev', // Connection string for your MongoDB database
  cloud: __dirname + '/cloud.js', // Absolute path to your Cloud Code
  appId: 'XYZ',
  masterKey: 'ABC', // Keep this key secret!
  fileKey: 'file-key-not-sure',
  serverURL: 'https://citizen-molecularcode.c9users.io/parse' // Don't forget to change to https if needed
});

// Serve the Parse API on the /parse URL prefix
app.use('/parse', api);


/* this says: serve all the files in the src directory if they match the URL. Eg , if the client requests http://server/css/app.css then the file in src/css/app.css will be served. But if the client requests http://server/step-2 then since there is no file by that name the middleware will call next() */
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());

/* REP FUNCTION CALLS ------------------------------------------------------- */
/* insert any app.get or app.post you need here. */
// New AJAX call to the rep name for the url
app.post('/repnameget', function(req, res) {
  getRepName(req.body.postalcode, function(err, nameFormatted) {
    if(err) {
      console.log(err);
      return;
    }
    else {
      res.send(nameFormatted);
    }
  });
});

//AJAX call to get the Rep object and make it available to the frontend
app.post('/repinfoget', function(req, res) {
  getRepInfo(req.body.repName, function(err, rep) {
    if (err) {
      console.log(err);
      return;
    }
    getPercentageVote(rep.ridingId, function(err, percentageVote) {
      if (err) {
        console.log(err);
        return;
      }
      else{
      rep.electedVote = percentageVote;
      res.send(rep);
      }
    });
  });
});
/* -------------------------------------------------------------------------- */

/* BILLS FUNCTION CALLS ------------------------------------------------------- */
app.post('/postfilter', function(req, res) {
  req = req.body.filter;
  // console.log(req, 'req');
  switch (req) {
    case 'active':
      fixLimitByPage(function(err, limit) {
        if (err) {
          console.log(err);
          return;
        }
        getAllVotes(limit, function(err, arrOfVotes) {
          if (err) {
            console.log(err);
            return;
          }
          var billsWithoutTitle = getListOfBillsFromVotes(arrOfVotes);
          
          getTitleOfBill(function(err, billsWithTitle) {
            if (err) {
              console.log(err);
              return;
            }

            var listOfBillsWithTitle = getListOfBillsWithTitle(billsWithoutTitle, billsWithTitle);
          
            var listOfUniqueBills = getUniqueBillsByDate(listOfBillsWithTitle);
              res.send(listOfUniqueBills);
            });
          });
        });
      break;

    case 'passed':
    case 'failed':
      fixLimitByPage(function(err, limit) {
        if (err) {
          console.log(err);
          return;
        }
        getAllVotes(limit, function(err, arrOfVotes) {
          if (err) {
            console.log(err);
            return;
          }
          var billsWithoutTitle = getListOfBillsFromVotes(arrOfVotes);

          getTitleOfBill(function(err, billsWithTitle) {
            if (err) {
              console.log(err);
              return;
            }
            var listOfBillsWithTitle = getListOfBillsWithTitle(billsWithoutTitle, billsWithTitle);

            var listOfUniqueBills = getUniqueBillsByDate(listOfBillsWithTitle);

            var listOfUniqueBillsByResult = filterUniqueBillsByResult(listOfUniqueBills, req);
            res.send(listOfUniqueBillsByResult);
          });
        });
      });
      break;

    case 'all':
      fixLimitByPage(function(err, limit) {
        if (err) {
          console.log(err);
          return;
        }
        getAllBills(limit, function(err, arrOfBills) {
          if (err) {
            console.log(err);
            return;
          }
          var allBillsClean = allBills(arrOfBills);
          res.send(allBillsClean);
        });
      });
      break;

    case 'votedonbymyrep':
      fixLimitByPage(function(err, limit) {
        if (err) {
          console.log(err);
          return;
        }
        getBallotsByPolitician(limit, "tony-clement", function(err, listOfBallots){
          getAllVotes(limit, function(err, arrOfVotes) {
            if (err) {
              console.log(err);
              return;
            }
            var billsWithoutTitle = getListOfBillsFromVotes(arrOfVotes);

            getTitleOfBill(function(err, billsWithTitle) {
              if (err) {
                console.log(err);
                return;
              }
              var ballotsOnlyAboutBill = getBallotsAboutBillWithTitle(billsWithoutTitle, billsWithTitle, listOfBallots);
            
              var ballotsByUniqueDate = getUniqueBillsByDate(ballotsOnlyAboutBill);

              res.send(ballotsByUniqueDate);
            });
          });
        });
      });
      break;
    
    case 'proposedbymyrep':
      fixLimitByPage(function(err, limit) {
        if (err) {
          console.log(err);
          return;
        }
        getAllVotes(limit, function(err, arrOfVotes) {
          if (err) {
            console.log(err);
            return;
          }
          var billsWithoutTitle = getListOfBillsFromVotes(arrOfVotes);

          getTitleOfBill(function(err, billsWithTitle) {
            if (err) {
              console.log(err);
              return;
            }
            var listOfBillsWithTitle = getListOfBillsWithTitle(billsWithoutTitle, billsWithTitle);

            var listOfUniqueBills = getUniqueBillsByDate(listOfBillsWithTitle);

            getBillBySponsor("alexandre-boulerice", function(err, listOfBillsSponsored) {
              if (err) {
                console.log(err);
                return;
              }
              var ultimateVoteAboutBillSponsored = getUltimateVotedFromBillId(listOfBillsSponsored, listOfUniqueBills);
              res.send(ultimateVoteAboutBillSponsored);
            });
          });
        });
      });
      break;
    
    default:
      res.send([]);
  }
});
/* -------------------------------------------------------------------------- */


// /* BILLS FUNCTION CALLS ------------------------------------------------------- */
// app.post('/billinfoget', function(req, res) {
// req = req.body.billId;
 
 
 
 
// }); 
/* ------------------------------------------------------------------------------ */



/* This says: for any path NOT served by the middleware above, send the file called index.html instead. Eg, if the client requests http://server/step-2 the server will send the file index.html. Then on the browser, React Router will load the appropriate component */
app.get('/*', cors(corsOptionsDelegate),  function(request, response, next) {
  response.sendFile(__dirname + '/public/index.html');
});
app.listen(process.env.PORT || 8080, function() {
  console.log('server started');
});