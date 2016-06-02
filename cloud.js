/*global Parse */

/* Handle Bill Votes -------------------------------------------------------- */
var Vote = Parse.Object.extend('Vote');

Parse.Cloud.define('handleVote', function(request, response) {
  
  if (!request.user) {
    response.error("You have to be logged in");
    return;
  }
  var query = new Parse.Query(Vote);
  
  query.equalTo('userId', request.user.id).equalTo('billId', request.params.billId);
  
  query.find().then(function(votes) {
    if (votes.length) {
      var vote = votes[0];
    }
    else {
      vote = new Vote();
      vote.set({userId: request.user.id, billId: request.params.billId});
    }
    
    vote.set('vote', request.params.vote);
    
    vote.save().then(function(vote) {
      response.success(vote);
    });
  });
});

Parse.Cloud.define('findMyVote', function(request, response) {
  if (!request.user) {
    response.error("You have to be logged in");
    return;
  }
  var query = new Parse.Query(Vote);
  query.equalTo('userId', request.user.id).equalTo('billId', request.params.billId);

  query.find().then(function(votes) {
    if (votes.length) {
      var vote = votes[0];
      response.success(vote);
    }
    else {
      response.success(null);
    }
  });
});

// NEED TO WRITE
// QUERY CURRENT USER AND GET BACK AN ARRAY OF VOTES AND BILLIDS
Parse.Cloud.define('myVoteInfo', function(request, response) {
  if (!request.user) {
    response.error("You have to be logged in");
    return;
  }
  var query = new Parse.Query(Vote);
  query.equalTo('userId', request.user.id);

  query.find().then(function(votes) {
      response.success(votes);
  });
});