var Vote = Parse.Object.extend('Vote');

Parse.Cloud.define('handleVote', function(request, response) {
  
  var query = new Parse.Query(Vote);
  
  query.equalTo('userId', request.params.userId).equalTo('billId', request.params.billId);
  
  query.find().then(function(votes) {
    if (votes.length) {
      var vote = votes[0];
    }
    else {
      vote = new Vote();
      vote.set({userId: request.params.userId, billId: request.params.billId});
    }
    
    vote.set('vote', request.params.vote);
    
    vote.save().then(function(vote) {
      response.success(vote);
    })
  })
  

})