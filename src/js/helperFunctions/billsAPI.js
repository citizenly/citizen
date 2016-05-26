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
var findBillId = require("./findBillId.js")

/*At this url there are all the votes of the current session of the current parlement
'http://api.openparliament.ca/votes/?date=&session=42-1&format=json';
By default, the limit of results by page is setting at 20 and the order of the result is starting by the highest.  
As every vote in a session has a sequential number, we set the limit to 
to the highest vote's number
*/

function fixLimitByPage(callback) {
  var add = 'http://api.openparliament.ca/votes/?session=42-1&limit=1&format=json';
  request(add, function(err, result){
    if (err) {
      callback(err);
    }
    else {
      var lastVote = JSON.parse(result.body);
      var numberLastVote = lastVote.objects[0].number;
      callback(numberLastVote);
    }
  });
}
 

//Calling this function with a callback, we recive an arrry of votes
function getAllVotes(limit, callback) {
  var allVotes = `http://api.openparliament.ca/votes/?date=&session=42-1&limit=${limit}&format=json`;
  request(allVotes, function(err, result) {
    if (err) {
      callback(err);
    }
    else {
      var votes = JSON.parse(result.body);
      var arrOfVotes = votes.objects;
      callback(arrOfVotes);
    }
  });
}

function getListofBillsFromVotes(arrOfVotes, callback) {
  var bills = [];
  arrOfVotes.forEach(function(vote) {
    var result = vote.result;
    var date = vote.date;
    var number = vote.number;
    var billId = findBillId.findBillId(vote.bill_url);

    var bill = {
      result: result,
      date: date,
      number: number,
      billId: billId
    };

    //Not all the votes is about a bill, so we want to keep only the bills
    if (bill.billId.length > 0) {
      bills.push(bill);
    }

  });
  callback(bills);
}

function getTitleOfBill(bills, callback) {
  bills.forEach(function(bill){
    var billTitle;
  })
}

function getUniqueBillsByDate(bills, callback) {

  var bin = {};
  var allBills = [];
  bills.filter(function(obj) {
    bin[obj.billId] = bin[obj.billId] || [];
    bin[obj.billId].push(obj);
  })
  var filterdBills = [];
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

    })
    allBills.push(latestBill);
  }
  callback(allBills);

}


module.exports = {
  getAllVotes: getAllVotes,
  getListofBillsFromVotes: getListofBillsFromVotes,
  getUniqueBillsByDate: getUniqueBillsByDate,
  fixLimitByPage: fixLimitByPage
};

