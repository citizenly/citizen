var makeRequest = require("./openAPI.js");
//https://api.openparliament.ca/politicians/ziad-aboultaif/

// For each politicien, we can get what they are doing by their speeches in the House, their tweeter feed or 
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