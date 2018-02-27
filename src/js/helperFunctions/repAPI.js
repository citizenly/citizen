/* http://represent.opennorth.ca/postcodes/L5G4L3/?sets=federal-electoral-districts
Request URLs must include the postal code in uppercase letters with no spaces.URLs */
var request = require("request");
var unaccented = require("./unaccented.js");
var percentageVotes = require("./percentageVotes.js");
var makeRequest = require("./openAPI.js");
var makePcRequest = require("./representAPI.js");

/*PEDRO, I found this function for tests to see if string is in correct UK style postcode: AL1 1AB, BM1 5YZ etc. We should also add something that makes the input be in capitals if not originally so. */ 
// function isValidPostcode(p) { 
//     var postcodeRegEx = /[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}/i; 
//     return postcodeRegEx.test(p); 
// }


//The user inputs their postal code.  With this data, we request the name of their MP and format it as name-surname
function getRepName (postalCode, callback) {
  //At this point, we have a valid postal code, so we look for the name of the MP
  console.log("it works");
  var findMPbyPC = `getMP?postcode=${postalCode}&key=GYEChCGV3YEuA6ezszEvyj7J&output=js`;
  makePcRequest(findMPbyPC, function(err, mpInfo){
    if (err) {
      callback(err);
    }
    else {
    //we have to format the name to be sure that is all lowercase, without accent and with a dash between firstname and lastname
    // var nameFormatted = mpInfo.name.replace(" ","-").toLowerCase();
    // mpInfo.nameFormatted = nameFormatted;
    callback(null, {allRepData: mpInfo});
    }
  });
}  

function getRepInfo(repData, callback) {

      var mp = repData;
      var name = repData.name;
      var constituency = repData.constituency;
      var party = repData.party;
      var image = repData.repImage;
      var enteredHouse = repData.entered_house;
      var ridingId = "";
      var province = "";

      var rep = {
        mp: mp,
        name: name,
        nameFormatted: repData.name,
        constituency: constituency,
        province: province,
        party: party,
        img: image,
        ridingId: ridingId,
        electedYear: enteredHouse,
      };
      console.log('rep whole obj', rep);
      callback(null, rep);
}

// return the majority vote percentage using the riding ID and parsing a .csv
function getPercentageVote(ridingId, callback){
  percentageVotes.percentageVotes(ridingId, function(err, percentage){
    if (err) {
      console.log(err);
      return;
    }
    else{
    callback(null, percentage);
    }
  });
}




module.exports = {
  getRepName: getRepName,
  getRepInfo: getRepInfo,
  getPercentageVote: getPercentageVote
};