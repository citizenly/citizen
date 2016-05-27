/*
ID / official name
Title
Summary
Full Text
House Debate
Status tag - active/inactive
Proposed by
*/

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
  var url = 'votes/?session=42-1&limit=1';
  // Make request to api.openparliament.ca and cache
  makeRequest(url, function(err, res){
    var numberLastVote = res.objects[0].number;
    callback(numberLastVote);
  });
}
 

//Calling this function with a callback, we recive an arrry of votes
// Get array of objects of all bills voted on in current session
function getAllVotes(limit, callback) {
  var allVotes = `votes/?date=&session=42-1&limit=${limit}&format=json`;
  makeRequest(allVotes, function(err, res){
    var arrOfVotes = res.objects;
    callback(arrOfVotes);
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

    var bill = {
      result: result,
      date: date,
      number: number,
      billId: billId,
      billUrl: billUrl,
     // billTitle: ""
    };

    //Not all the votes is about a bill, so if the billId is not null, we want to keep it because it's a bill
    if (bill.billId.length > 0) {
      bills.push(bill);
    }
  });
  callback(bills);
}

//http://api.openparliament.ca/bills/?session=42-1&limit=500
function getTitleOfBill(callback) {
  var billsWithTitle = [];
  var allBills = "bills/?session=42-1&limit=500";
  makeRequest(allBills, function(err, bills){
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