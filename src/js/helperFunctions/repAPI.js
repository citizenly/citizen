/* http://represent.opennorth.ca/postcodes/L5G4L3/?sets=federal-electoral-districts
Request URLs must include the postal code in uppercase letters with no spaces.URLs */
var request = require("request");
var unaccented = require("./unaccented.js");
var percentageVotes = require("./percentageVotes.js");
var makeRequest = require("./openAPI.js");
var makePcRequest = require("./representAPI.js");
var makeHansardRequest = require("./representAPI.js");


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

function getHansard (repId, callback) {
  console.log("getHansard is getting called", "repId", repId);
  var findHansardById = `getHansard?person=${repId}&key=GYEChCGV3YEuA6ezszEvyj7J&output=js`;
  makeHansardRequest(findHansardById, function(err, hansardInfo){
    if (err) {
      callback(err);
    }
    else {
    callback(null, {allHansardData: hansardInfo});
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
  getHansard: getHansard,
  getRepInfo: getRepInfo,
  getPercentageVote: getPercentageVote
};