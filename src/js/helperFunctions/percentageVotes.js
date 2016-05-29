var csv = require('csv-parser')
var fs = require('fs')


var percentageVotes = function(ridingId, callback) {
  ridingId = ridingId.toString();
  var votes = "";
  fs.createReadStream('./src/assets/mpRidingVote.csv')
    .pipe(csv())
    .on('data', function(data) {
      if (data) {
        try {
          if (ridingId === data.RidingId && data.Majority.length > 0) {
            votes = data.PercentageVotes;
            callback(null, votes);
          }
        }
        catch (err) {
          callback(err);
        }
      }
    })
}


module.exports = {
  percentageVotes: percentageVotes
}

