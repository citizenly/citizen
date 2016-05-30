var makeRequest = require("./openAPI.js");
var getVoteNumber = require("./findVoteNumber.js");

//http://api.openparliament.ca/bills/42-1/C-1/?format=json

function getBill(billId, callback) {
  var path = `bills/42-1/${billId}`;
  makeRequest(path, function(err, bill){
    if(err){
      callback(err);  
    }
    else{
      bill = {
      id: bill.number,
      title: bill.name.en,
      summaryUrl: bill.text_url,
      textUrl: bill.text_url,
      voteNumber: getVoteNumber(bill.vote_urls[0]),
      proposedByUrl: bill.sponsor_politician_url
      };
      callback(null, bill);
    }
  });
}

function getSponsor(proposedByUrl, callback) {
  var path = proposedByUrl.slice(0, -1);
  makeRequest(path, function(err, politician){
    if(err){
      callback(err);  
    }
    else{
      var proposedBy = politician.name;
      callback(null, proposedBy);
    }
  });
}

function getResultOfLastVote(voteNumber, callback){
  var path = `votes/?number=${voteNumber}&session=42-1`;
  makeRequest(path, function(err, vote){
    if(err){
      callback(err);  
    }
    else{
      var voteResult = vote.objects[0].result;
      callback(null, voteResult);
    }
  });
}

//https://api.openparliament.ca/votes/?number=38&session=42-1


/* TEST FUNCTIONS ----------------------------------------------------------- */
getBill("C-2", function(err, bill) {
  if (err) {
    console.log(err);
    return;
  }
  getSponsor(bill.proposedByUrl, function(err, proposedBy) {
    if (err) {
      console.log(err, "THIS IS ERROR");
      return;
    }
    bill.proposedBy = proposedBy;
    
    getResultOfLastVote(bill.voteNumber, function(err, voteResult){
      if (err) {
        console.log(err, "THIS IS ERROR");
        return;
      }
      bill.voteResult = voteResult;
      console.log(bill, "THIS IS BILL");  
      
    })
  })
})