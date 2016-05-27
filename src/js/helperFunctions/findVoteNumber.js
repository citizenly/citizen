function getVoteNumber(voteUrl){
  var urlSeparated = voteUrl.substring(-1, voteUrl.length-1).split("/");
  var voteNumber = urlSeparated[urlSeparated.length-1];
  return(voteNumber);
}

module.exports = getVoteNumber;

