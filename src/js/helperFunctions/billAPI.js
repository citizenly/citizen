/*
ID / official name
Title
Summary
Full Text
House Debate
Status tag - active/inactive
Proposed by
*/

console.log("hello")
var request = require("request");

//All the votes of the current session of the current parlement
function getAllVotes (callback) {
  var allVotes = 'http://api.openparliament.ca/votes/?date=&session=42-1&format=json';
  console.log(allVotes);
  request(allVotes, function(err, result){
    if(err) {
      callback(err);
    }else {
      var votes = JSON.parse(result.body);
      var bills = [];
      var eachVotes = votes.objects.forEach(function(vote) {
        var result = vote.result;
        var date = vote.date;
        var number = vote.number;
        var billId = findBillId(vote.bill_url);
        
        var bill = {
          result: result,
          date: date,
          number: number,
          billId: billId
          }; 
        
        if(bill.billId.length > 0) {
          bills.push(bill);
        }  
      })
      
      
      
      callback(bills);
    }
  });
}


function findBillId(urlBill) {
    var partsOfBill = urlBill.substring(-1, bill.length-1).split("/");
    return partsOfBill[partsOfBill.length-1];
}

getAllVotes(function(r) {
  console.log(r);
});

