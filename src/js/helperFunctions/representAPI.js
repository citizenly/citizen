var request = require("request");
var server = require('../memcached.js');
var API_URL = "https://www.theyworkforyou.com/api/";
// For a postcode the above API_URL returns
// {
//   "member_id" : "41553",
//   "house" : "1",
//   "constituency" : "Bristol South",
//   "party" : "Labour",
//   "entered_house" : "2017-06-09",
//   "left_house" : "9999-12-31",
//   "entered_reason" : "general_election",
//   "left_reason" : "still_in_office",
//   "person_id" : "25390",
//   "lastupdate" : "2017-06-09 02:52:19",
//   "title" : "",
//   "given_name" : "Karin",
//   "family_name" : "Smyth",
//   "full_name" : "Karin Smyth",
//   "url" : "/mp/25390/karin_smyth/bristol_south",
//   "image" : "/images/mpsL/25390.jpeg",
//   "image_height" : 80,
//   "image_width" : 60
// }

function makePcRequest(path, callback) {
  server.get(path, function(err, data){
    if(data){
      try {
        data = JSON.parse(data);
        console.log("data received from memcached ");
        callback(null, data);
      } catch(err){
        callback(err);
      }
    }
    else {
      var mark;
      if(path.indexOf("?") === -1) {
        mark = "?";
      }
      else {
        mark = "&";
      }
      console.log("path22", path);
      request(`${API_URL}${path}`, function(err, res){
        if(err){
          callback(err);
        }
        else {
          try {
            res = JSON.parse(res.body);
            server.set(path, JSON.stringify(res), function(){
              console.log("data received from the web");
              callback(null, res);
            }, 12*60*60);
          } catch(err) {
            callback(err);
          }
        }
      });
    }
  });
}

module.exports = makePcRequest;