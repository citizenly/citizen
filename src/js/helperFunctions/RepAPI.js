/* http://represent.opennorth.ca/postcodes/L5G4L3/?sets=federal-electoral-districts
Request
URLs must include the postal code in uppercase letters with no spaces.URLs */

var request = require("request");
var unaccented = require("./unaccented.js");
var percentageVotes = require("./percentageVotes.js");
var rep = {};
var postCode = '';

//This function is called by the server and return an object with all the infos about the mp

function handleResult(postalCode, callback) {
  //At this point, we have a valid postal code, so we request the name of the MP 
  // this is probably asynchronous, so the handleResult func requires a callback
  postCode = postalCode;
  var findMPbyPC = `http://represent.opennorth.ca/postcodes/${postalCode}/?sets=federal-electoral-districts`;
  request(findMPbyPC, function(err, result) {
    if (err) {
      return err;
    }
    else {
      var mpName = JSON.parse(result.body);
      var name = mpName.representatives_centroid[0].name;
      //we have to formatted the name to be sure that is all lowercase, without accent and with a dash between firstname and lastname
      var nameFormatted = unaccented.unaccented(name);
      //with the name of MP formatted, we request his data
      var findMP = `https://api.openparliament.ca/politicians/${nameFormatted}/?format=json`;
      request(findMP, function(err, result) {
        var mp = JSON.parse(result.body);
        var constituency = mp.memberships[0].riding.name.en;
        var party = mp.memberships[0].party.short_name.en;
        var image = "https://api.openparliament.ca" + mp.image;
        var electedOn = mp.memberships[0].start_date.substring(0, 4);
        var ridingId = mp.memberships[0].riding.id;
        var favoriteWord = mp.other_info.favourite_word[0];
        var province = mp.memberships[0].riding.province;

        rep = {
          name: name,
          constituency: constituency,
          province: province,
          party: party,
          img: image,
          ridingId: ridingId,
          electedYear: electedOn,
          electedVote: ''
        };
        callback(rep);
      });
    }
  });
}



// return the majority vote percentage using the riding ID and parsing a .csv
function handlePercentageVote(ridingId, callback){
    percentageVotes.percentageVotes(ridingId, function(r){
      callback(r);
    });
}

module.exports = {handleResult: handleResult, handlePercentageVote: handlePercentageVote};