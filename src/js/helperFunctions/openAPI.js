var request = require("request");
var server = require('../memcached.js');
var API_URL = "https://api.openparliament.ca/";

function makeRequest(path, callback) {
  server.get(path, function(err, data){
    if(data){
      try {
        data = JSON.parse(data);
        console.log("data received from memcached");
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
      var options = {
        url: `${API_URL}${path}${mark}format=json`,
        headers: {
          'User-Agent': 'marie.eve.gauthier@hotmail.com'
        }
      };
      request(options, function(err, res){
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

module.exports = makeRequest;