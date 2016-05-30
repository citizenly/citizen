var request = require("request");
var $ = require('jquery');
var memcached = require('memcached');
var server = new memcached('localhost:11211');



function makeTextRequest(path, callback) {
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
      var options = {
        url: path,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1'
        }
      };
      request(path, function(err, response){
        if(err){
          console.log(err, '***error***');
        }
        else {
          console.log(response.body);
        }
      });
    }
  });
}

makeTextRequest ("http://www.parl.gc.ca/HousePublications/Publication.aspx?Language=E&Mode=1&DocId=8266110&Col=1", function(err, billSummary) {
  console.log(billSummary, 'billSummary');
});

//module.exports = makeTextRequest;