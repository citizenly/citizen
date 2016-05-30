var makeRequest = require("./openAPI.js");
var getVoteNumber = require("./findVoteNumber.js");



function getBill(billId, callback) {
  var path = `bills/42-1/${billId}`;
  makeRequest(path, function(err, bill){
    if(err){
      callback(err);  
    }
    else{
      bill = {
      status: bill.status.en,
      isLaw: bill.law,
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
      var lastVote = vote.objects[0].result;
      callback(null, lastVote);
    }
  });
}

function getBallot(proposedByUrl, voteNumber, callback) {
  var politician = proposedByUrl.substring(-1, proposedByUrl.length - 1).split("/");
  politician = politician[politician.length - 1];
  var path = `votes/ballots/?politician=${politician}&vote=42-1%2F${voteNumber}`;
  makeRequest(path, function(err, ballot) {
    if (err) {
      callback(err);
    }
    else {
      ballot = ballot.objects[0].ballot;
      callback(null, ballot);
    }
  });
}

module.exports = {
  getBill: getBill,
  getSponsor: getSponsor,
  getResultOfLastVote: getResultOfLastVote,
  getBallot: getBallot
};




/* TEST FUNCTIONS ----------------------------------------------------------- */
// getBill("C-2", function(err, bill) {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   getSponsor(bill.proposedByUrl, function(err, proposedBy) {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     bill.proposedBy = proposedBy;
    
//     getResultOfLastVote(bill.voteNumber, function(err, voteResult){
//       if (err) {
//         console.log(err);
//         return;
//       }
//       bill.voteResult = voteResult;
      
//       getBallot(bill.proposedByUrl, bill.voteNumber, function(err, ballot){
//         if(err){
//           console.log(err);
//           return
//         }
//         bill.repsVote = ballot;
//         res.send(bill)
//       }) 
//     })
//   })
// })