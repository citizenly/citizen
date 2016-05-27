

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
 

//Calling this function with a callback, we recive an arrry of votes
// Get array of objects of all bills voted on in current session
function getAllVotes(limit, callback) {
  var path = `votes/?date=&session=42-1&limit=${limit}&format=json`;
  makeRequest(path, function(err, res){
    if(err){
      callback(new Error("Oops.. we can't find the list of votes of the current session of the current parlement. Please try again!"));  
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
    var result = vote.result;
    var date = vote.date;
    var number = vote.number;
    var billId = findBillId.findBillId(vote.bill_url);
    var billUrl = vote.bill_url;
    var nay_total = vote.nay_total;
    var yea_total = vote.yea_total;

    var bill = {
      result: result,
      date: date,
      number: number,
      billId: billId,
      billUrl: billUrl,
      nay_total: nay_total,
      yea_total: yea_total
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
      var x = new Date(prev.date);
      var y = new Date(next.date);
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

// function getVoteNumber(bills, billId, callback){
//   bills.map(function(bill){
//     })
// }

fixLimitByPage(function(limit) {
  getBallotsByPolitician(limit, "tony-clement", function(balllotsByPolitician){
    console.log(balllotsByPolitician);
  });
});

module.exports = {
  getAllVotes: getAllVotes,
  getListofBillsFromVotes: getListofBillsFromVotes,
  getUniqueBillsByDate: getUniqueBillsByDate,
  fixLimitByPage: fixLimitByPage,
  getListOfBillsWithTitle: getListOfBillsWithTitle,
  getTitleOfBill: getTitleOfBill
  
};



/* TEST FUNCTIONS ----------------------------------------------------------- */
// fixLimitByPage(function(limit) {
//   getAllVotes(limit, function(arrOfVotes) {
//     getListofBillsFromVotes(arrOfVotes, function(bills) {
//       getTitleOfBill(function(billsWithTitle){
//         getListOfBillsWithTitle(bills, billsWithTitle, function(listOfBillsWithTitle){
//           getUniqueBillsByDate(listOfBillsWithTitle, function (listOfUniqueBills){
//             console.log(listOfUniqueBills);
//           });
//         });
//       });
//     });
//   });
// });