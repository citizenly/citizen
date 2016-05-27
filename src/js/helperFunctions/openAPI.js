var request = require("request");
var memcached = require('memcached');
var server = new memcached('localhost:11211');
var API_URL = "https://api.openparliament.ca/";

function makeRequest(path, callback) {
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
      request(`${API_URL}${path}${mark}format=json`, function(err, res){
        if(err){
          callback(err);
        }
        else {
          try {
            res = JSON.parse(res.body);
            server.set(path, JSON.stringify(res), 12*60*60, function(){
              console.log("data received from the web");
              callback(null, res);
            });
          } catch(err) {
            callback(err);
          }
        }
      });
    }
  });

}

//WHERE WE HAVE TO ADD THAT?
//var options = {
//     uri: add,
//     // qs: {
//     //     access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
//     // },
//     headers: {
//         'User-Agent': 'marie.eve.gauthier@hotmail.com'
//     },
//     json: true // Automatically parses the JSON string in the response
// };

module.exports = makeRequest;