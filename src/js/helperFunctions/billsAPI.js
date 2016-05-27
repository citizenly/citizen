var request = require("request");
var findBillId = require("./findBillId.js");
var makeRequest = require("./openAPI.js");



/*At this url there are all the votes of the current session of the current parlement
'http://api.openparliament.ca/votes/?date=&session=42-1&format=json';
By default, the limit of results by page is setting at 20 and the order of the result is starting by the highest.  
As every vote in a session has a sequential number, we set the limit to 
to the highest vote's number */
// Get number of most recent voting session to use a limit param in url requests
function fixLimitByPage(callback) {
  var path = 'votes/?session=42-1&limit=1';
  // Make request to api.openparliament.ca and cache
  makeRequest(path, function(err, res){
    if(err){
      callback(err)
    }
    else {
      var numberLastVote = res.objects[0].number;
      callback(numberLastVote);
    }
  });
}


// Get array of objects of all bills (Commons and Senate) in current session
function getAllBills(limit, callback) {
  var path = `bills/?session=42-1&limit=${limit}`;
  makeRequest(path, function(err, res){
    if(err){
      callback(new Error("Oops.. we can't find the list of bill of the current session of parliament. Please try again!"));  
    }
    else{
      var arrOfBills = res.objects;
      callback(arrOfBills);
    }
  });
}


// Reduce the raw bill object to the name, and id
function allBills(arrOfBills, callback) {
  var allBills = [];
  arrOfBills.forEach(function(bill) {
    var billId = bill.number;
    var billTitle = bill.name.en;

    bill = {
      billId: billId,
      billTitle: billTitle
    };
    allBills.push(bill);
  });
  callback(allBills);
}
 

//Calling this function with a callback, we recive an arrry of votes
// Get array of objects of all bills voted on in current session
function getAllVotes(limit, callback) {
  var path = `votes/?date=&session=42-1&limit=${limit}&format=json`;
  makeRequest(path, function(err, res){
    if(err){
      callback(new Error("Oops.. we can't find the list of votes of the current session of parliament. Please try again!"));  
    }
    else{
      var arrOfVotes = res.objects;
      callback(arrOfVotes);
    }
  });
}


// Store only the bill info we need in the array of bill objects - without the title
function getListofBillsFromVotes(arrOfVotes, callback) {
  var bills = [];
  arrOfVotes.forEach(function(vote) {
    var resultOfVote = vote.result;
    var dateOfVote = vote.date;
    var voteSessionId = vote.number;
    var billId = findBillId.findBillId(vote.bill_url);
    var billUrl = vote.bill_url;
    var noVotesTotal = vote.nay_total;
    var yesVotesTotal = vote.yea_total;

    var bill = {
      resultOfVote: resultOfVote,
      dateOfVote: dateOfVote,
      voteSessionId: voteSessionId,
      noVotesTotal: noVotesTotal,
      yesVotesTotal: yesVotesTotal,
      billId: billId,
      billUrl: billUrl
    };

    //Not all the votes is about a bill, so if the billId is not null, we want to keep it because it's a bill
    if (bill.billId.length > 0) {
      bills.push(bill);
    }
  });
  callback(bills);
}


function getTitleOfBill(callback) {
  var billsWithTitle = [];
  var path = "bills/?session=42-1&limit=500";
  makeRequest(path, function(err, bills){
    if(err){
      callback(new Error("Oops.. we can't find the bills for the moment. Please try again!"));
    }
    else {
      bills = bills.objects;
      bills.forEach(function(bill) {
        var title = bill.name.en;
        var billId = bill.number;
        
        var billWithTitle = {
          title: title,
          billId: billId
        };
      
        billsWithTitle.push(billWithTitle);
      });
      callback(billsWithTitle); 
    }
  });
}

//In the array of bill objects, add the title of each bill 
function getListOfBillsWithTitle(bills, billsWithTitle, callback){
  var listOfBillsWithTitle = [];
  bills = bills.map(function(bill){
    var billId = bill.billId;
    
    var title = billsWithTitle.find(function(billWithTitle) {
      return billWithTitle.billId === billId;
    });
    
    if(title){
      bill.billTitle = title.title;
      listOfBillsWithTitle.push(bill);
    }
    else{
      bill.billTitle = 'N/A';
      listOfBillsWithTitle.push(bill);
    }
  });
  callback(listOfBillsWithTitle);
}


// Reduce the array to only unique bills and only the most recently voted on version of the bill
function getUniqueBillsByDate(bills, callback) {
  var bin = {};
  var allBills = [];
  
  bills.filter(function(obj) {
    bin[obj.billId] = bin[obj.billId] || [];
    bin[obj.billId].push(obj);
  });
  
  //var filterdBills = [];
  for (var bill in bin) {
    var latestBill = bin[bill].reduce(function(prev, next) {
      var x = new Date(prev.dateOfVote);
      var y = new Date(next.dateOfVote);
      if (x < y) {
        return next;
      }
      else {
        return prev;
      }
    });
    allBills.push(latestBill);
  }
  callback(allBills);
}


// Filter unique bills by result of Passed, Failed or Tie
function filterUniqueBillsByResult(listOfUniqueBills, resultOfVote, callback) {
  var billsPassed = [];
  var billsFailed = [];
  var billsTied = [];
  resultOfVote = resultOfVote.charAt(0).toUpperCase() + resultOfVote.slice(1);
  
  listOfUniqueBills.forEach(function(bill) {
    if (bill.resultOfVote === 'Passed') {
      billsPassed.push(bill);
    }
    else if (bill.resultOfVote === 'Failed') {
      billsFailed.push(bill);
    }
    else {
      billsTied.push(bill);
    }
  });
  if (resultOfVote === 'Passed') {
    callback(billsPassed);
  }
  else if (resultOfVote === 'Failed') {
    callback(billsFailed);
  }
  else {
    callback(billsTied);
  }
}

/*To know how vote every MP, we need to look at ballots:
http://api.openparliament.ca/votes/ballots/?format=json
The balllots can be filter by voteNumber and by politician
//http://api.openparliament.ca/votes/ballots/?politician=sherry-romanado&vote=42-1%2F63
*/
function getBallotsByPolitician(limit, politician, callback){
  //votes/ballots/?politician=tony-clement&format=json&limit=63
  var path = `votes/ballots/?politician=${politician}&limit=${limit}`;
  makeRequest(path, function(err, res){
    if(err){
      callback(new Error("Oops..we can't find how your MP voted on this bill. Please try again!"));
    }
    else {
      var ballots = res.objects;
      callback(ballots);
    }
  });
}


module.exports = {
  getAllVotes: getAllVotes,
  getListofBillsFromVotes: getListofBillsFromVotes,
  getUniqueBillsByDate: getUniqueBillsByDate,
  fixLimitByPage: fixLimitByPage,
  getListOfBillsWithTitle: getListOfBillsWithTitle,
  getTitleOfBill: getTitleOfBill,
  filterUniqueBillsByResult: filterUniqueBillsByResult,
  getAllBills: getAllBills,
  allBills: allBills
};


/* TEST FUNCTIONS ----------------------------------------------------------- */
// fixLimitByPage(function(limit) {
//   getBallotsByPolitician(limit, "tony-clement", function(balllotsByPolitician){
//     console.log(balllotsByPolitician);
//   });
// });


// function getVoteNumber(bills, billId, callback){
//   bills.map(function(bill){
//     })
// }


// fixLimitByPage(function(limit) {
//   getAllBills(limit, function(arrOfBills) {
//     allBills(arrOfBills, function(allBills) {
//       console.log(allBills);
//     });
//   });
// });

// fixLimitByPage(function(limit) {
//   getAllVotes(limit, function(arrOfVotes) {
//     getListofBillsFromVotes(arrOfVotes, function(bills) {
//       getTitleOfBill(function(billsWithTitle){
//         getListOfBillsWithTitle(bills, billsWithTitle, function(listOfBillsWithTitle){
//           getUniqueBillsByDate(listOfBillsWithTitle, function(listOfUniqueBills){
//             filterUniqueBillsByResult(listOfUniqueBills, 'failed', function(listOfUniqueBillsByResult) {
//               console.log(listOfUniqueBillsByResult);
//             });
//           });
//         });
//       });
//     });
//   });
// });