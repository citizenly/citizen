var request = require("request");
var findBillId = require("./findBillId.js");
var getVoteNumber = require("./findVoteNumber.js");
var makeRequest = require("./openAPI.js");



/*At this url there are all the votes of the current session of the current parlement
'http://api.openparliament.ca/votes/?date=&session=42-1&format=json';
By default, the limit of results by page is setting at 20 and the order of the result is starting by the highest.  
As every vote in a session has a sequential number, we set the limit to 
to the highest vote's number */

// Get number of most recent voting session to use a limit param in url requests
// Doesn't take any params and callsback a number (limit)
function fixLimitByPage(callback) {
  var path = 'votes/?session=42-1&limit=1';
  // Make request to api.openparliament.ca and cache
  makeRequest(path, function(err, res){
    if(err){
      callback(err);
    }
    else {
      var numberLastVote = res.objects[0].number;
      callback(null, numberLastVote);
    }
  });
}


// Get array of objects of all bills (Commons and Senate) in current session
// Takes a number (limit) and callsback an array of bill objects (arrOfBills)
function getAllBills(limit, callback) {
  var path = `bills/?session=42-1&limit=${limit}`;
  makeRequest(path, function(err, res){
    if(err){
      callback(err);  
    }
    else{
      var arrOfBills = res.objects;
      callback(null, arrOfBills);
    }
  });
}


// Takes an array of bill objects (arrOfBills) and returns a modified array of bill objects (allBills)
function allBills(arrOfBills) {
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
  return allBills;
}


// Sort list of all bills alphabetically by separating into C- and S- bills, order by number (e.g. C-14) within C- and S-
// Takes an array of bill objects (allBills) and returns an ordered array of bill objects (billsSortedAlpha)
// function sortAllBillsAlpha (allBills) {
//   var billsC = [];
//   var billsS = [];

//   allBills.forEach(function(bill) {
//     console.log(bill.billId, 'bill.billId');
//     if (bill.billId.charAt(0) === 'C') {
//       billsC.push(bill);
//     }
//     else if (bill.billId.charAt(0) === 'S') {
//       billsS.push(bill);
//     }
//   });
//   console.log(billsC, 'billsC');
//   console.log(billsS, 'billsS');
//   console.log(billsC.concat(billsS), 'concat');
// }
 

// Get array of objects of all bills voted on in current session
// Takes a number (limit) and returns an array of bills-voted-on objects (arrOfVotes)
function getAllVotes(limit, callback) {
  var path = `votes/?date=&session=42-1&limit=${limit}&format=json`;
  makeRequest(path, function(err, res){
    if(err){
      callback(err);  
    }
    else{
      var arrOfVotes = res.objects;
      callback(null, arrOfVotes);
    }
  });
}

// Takes an array of bills-voted-on objects (arrOfVotes) and returns a modified array of bill objects (bills without the title)
function getListOfBillsFromVotes(arrOfVotes) {
  var billsWithoutTitle = [];
  arrOfVotes.forEach(function(vote) {
    var resultOfVote = vote.result;
    var dateOfVote = vote.date;
    var voteSessionId = vote.number;
    var billId = findBillId(vote.bill_url);   
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
      billsWithoutTitle.push(bill);
    }
 });
  return billsWithoutTitle;
}

//// Get array of objects of all bills in current session with its title
function getTitleOfBill(callback) {
  var billsWithTitle = [];
  var path = "bills/?session=42-1&limit=500";
  makeRequest(path, function(err, bills){
    if(err){
      callback(err);
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
      callback(null, billsWithTitle); 
    }
  });
}

//In the array of bill objects, add the title of each bill 
function getListOfBillsWithTitle(billsWithoutTitle, billsWithTitle){

    var listOfBillsWithTitle = [];
    var bills = billsWithoutTitle.map(function(bill){
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
    return listOfBillsWithTitle;
}


// Reduce the array to only unique bills and only the most recently voted on version of the bill
function getUniqueBillsByDate(listOfBillsWithTitle) {
  var bin = {};
  var listOfUniqueBills = [];
  
  listOfBillsWithTitle.filter(function(obj) {
    bin[obj.billId] = bin[obj.billId] || [];
    bin[obj.billId].push(obj);
  });
  
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
    listOfUniqueBills.push(latestBill);
  }
  return listOfUniqueBills;
}


// Takes an array of unique bill objects (listOfUniqueBills) and a 'result' string (resultOfVote) and returns an array of bill objects with the same bill.resultOfVote value
function filterUniqueBillsByResult(listOfUniqueBills, resultOfVote) {
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
    return billsPassed;
  }
  else if (resultOfVote === 'Failed') {
    return billsFailed;
  }
  else {
    return billsTied;
  }
}

/*To know how vote every MP, we need to look at ballots:
http://api.openparliament.ca/votes/ballots/?format=json
The balllots can be filter by politician. 
//http://api.openparliament.ca/votes/ballots/?politician=sherry-romanado&vote=42-1%2F63
Once we have the the list of ballots for a specific politician, we need its voteNumber.
With the voteNumber, we can find the name of the bill the vote was about.
*/
function getBallotsByPolitician(limit, politician, callback){
  var listOfBallots = [];
  var path = `votes/ballots/?politician=${politician}&limit=${limit}`;
  makeRequest(path, function(err, ballots){
    if(err){
      callback(err);
    }
    else {
      ballots = ballots.objects;
      ballots.forEach(function(ballot){
        var result = ballot.ballot;
        var voteUrl = ballot.vote_url;
        var voteNumber = getVoteNumber(voteUrl);
        
        var ballotCleaned = {
          ballot: result,
          voteUrl: voteUrl,
          voteNumber: voteNumber
        };

        listOfBallots.push(ballotCleaned);
      });
    }
    callback(null, listOfBallots);
  });
}

//Filter the ballots of each politician to keep only the one about bills
function getBallotsAboutBillWithTitle(billsWithoutTitle, billsWithTitle, ballots) {
  return ballots.map(function(ballot) {
    var theBillWithoutTitle = billsWithoutTitle.find(function(bill) {
      return bill.voteSessionId === Number(ballot.voteNumber);
    });
    
    if (!theBillWithoutTitle) {
      return null;
    }
    
    var theBillWithTitle = billsWithTitle.find(function(bill) {
      return bill.billId === theBillWithoutTitle.billId;
    });
    
    if (!theBillWithTitle) {
      return null;
    }
    
    ballot.title = theBillWithTitle.title;
    
    return ballot;
  })
  .filter(function(ballot) {
    return !!ballot;
  });
}

//http://api.openparliament.ca/bills/?session=42-1&limit=500&sponsor_politician=%2Fpolitician%2Fjustin-trudeau%2F
function getBillBySponsor(politician, callback) {
  var path = `bills/?session=42-1&limit=500&sponsor_politician=%2Fpolitician%2F${politician}`;
  var listOfBillsSponsored = [];
  makeRequest(path, function(err, res) {
    if (err) {
      callback(err);
    }
    else {
      if (res.objects.length === 0) {
        return ("Your MP doesn't sponsor any bill")
      }
      else {
        var billsSponsored = res.objects;
        billsSponsored.forEach(function(bill) {
          var name = bill.name.en;
          var billUrl = bill.url;
          var billId = bill.number;

          var billSponsored = {
            name: name,
            billUrl: billUrl,
            billId: billId
          };

          listOfBillsSponsored.push(billSponsored);
        });
      }
      callback(null, listOfBillsSponsored);
    }
  });  
}



module.exports = {
  getAllVotes: getAllVotes,
  getListOfBillsFromVotes: getListOfBillsFromVotes,
  getUniqueBillsByDate: getUniqueBillsByDate,
  fixLimitByPage: fixLimitByPage,
  getListOfBillsWithTitle: getListOfBillsWithTitle,
  getTitleOfBill: getTitleOfBill,
  filterUniqueBillsByResult: filterUniqueBillsByResult,
  getAllBills: getAllBills,
  allBills: allBills,
  getBallotsAboutBillWithTitle: getBallotsAboutBillWithTitle,
  getBallotsByPolitician: getBallotsByPolitician,
  getBillBySponsor: getBillBySponsor
};


/* TEST FUNCTIONS ----------------------------------------------------------- */
// fixLimitByPage(function(err, limit) {
//                 if (err) {
//                   console.log(err);
//                   return;
//                 }
//                 getBallotsByPolitician(limit, "tony-clement", function(err, listOfBallots) {
//                   if (err) {
//                     console.log(err);
//                     return;
//                   }
//                   getAllVotes(limit, function(err, arrOfVotes) {
//                     if (err) {
//                       console.log(err);
//                       return;
//                     }
      
//                   var billsWithoutTitle = getListOfBillsFromVotes(arrOfVotes);
      
//                   getTitleOfBill(function(err, billsWithTitle) {
//                     if (err) {
//                       console.log(err);
//                       return;
//                     }
        
//                   var ballotsOnlyAboutBill = getBallotsAboutBillWithTitle(billsWithoutTitle, billsWithTitle, listOfBallots);
        
//         console.log(ballotsOnlyAboutBill);
//         });
//     });
//   });
// });

// fixLimitByPage(function(limit) {
//   getAllBills(limit, function(arrOfBills) {
//     allBills(arrOfBills);
//     //sortAllBillsAlpha (allBills);
//   });
// });