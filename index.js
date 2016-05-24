/*
http://represent.opennorth.ca/postcodes/L5G4L3/?sets=federal-electoral-districts
Request
URLs must include the postal code in uppercase letters with no spaces.URLs

https://api.openparliament.ca/politicians/ziad-aboultaif/
Name
Constituency
Party
Image
When elected and how many votes 
Stats
Voter numbers (how many people voted to create a given stat)
Most frequently used words
What they're doing - activity feed

*/

var request = require("request");
var unaccented = require("./src/js/helper-function/unaccented.js");
var percentageVotes = require("./src/js/helper-function/percentageVotes.js");
var rep = {};
//The user input their postal code.  With this data, we request the name of their MP

//We have to validate that the postal code is all upperCase, that it has only 6 characters without white space and that these characters follow LNL NLN
//inside react, this could be a handleResult function 
function handleResult (postalCode, callback) {
  postalCode.toUpperCase().replace(/\s+/g, "");
  if(postalCode.length !== 6){
    return "invalid postal code";
  }
  else {
    var valid = /([ABCEGHJKLMNPRSTVXY]\d)([ABCEGHJKLMNPRSTVWXYZ]\d){2}/i;
    var ok = valid.test(postalCode);
    if (!ok){
      return "invalid postal code";
    }
    else {
      //At this point, we have a valid postal code, so we look for the name of the MP
      // this is probably asynchronous, so the handleResult func requires a callback
      var findMPbyPC = `http://represent.opennorth.ca/postcodes/${postalCode}/?sets=federal-electoral-districts`;
      request(findMPbyPC, function(err, result) {
        if (err){
          return err;
        }
        else {
          var mpName = JSON.parse(result.body);
          var name = mpName.representatives_centroid[0].name;
          //console.log(name, "name line 49");
          //we have to formatted the name to be sure that is all lowercase, without accent and with a dash between firstname and lastname
          var nameFormatted = unaccented.unaccented(name); 
          // console.log(nameFormatted, "nameFormatted line 52");
          //with the name of MP formatted, we fetch his data
          var findMP = `https://api.openparliament.ca/politicians/${nameFormatted}/?format=json`;
          request(findMP, function(err, result) {
            var mp = JSON.parse(result.body);
            var constituency = mp.memberships[0].riding.name.en;
            var party = mp.memberships[0].party.short_name.en;
            var image = "https://api.openparliament.ca" + mp.image;
            var electedOn = mp.memberships[0].start_date.substring(0,4);
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
              electedYear:electedOn,
              electedVote: ''
            };
            callback(rep);
          });
        }
      });
    }
  }
}


// return the majority vote percentage using the riding ID and parsing a .csv
function handlePercentageVote(ridingId, callback){
    percentageVotes.percentageVotes(ridingId, function(r){
      callback(r);
    });
}


// call the handleResult function as a callback containing the handlePercentageVote as a callback, then add vote to the object
handleResult('H4R1E9', function(rep) {
  handlePercentageVote(rep.ridingId, function(r) {
    rep.electedVote = r;
    console.log(rep);
    return rep;
  });
});