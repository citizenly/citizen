var request = require("request");
// cheerio required for website scraping / parsing the html returned
var $ = require('jquery');
var memcached = require('memcached');
var server = new memcached('localhost:11211');

function makeTextRequest(path, callback) {
  server.get(path, function(err, data){
    if(data){
    //   try {
    //     data = JSON.parse(data);
    //     console.log("data received from memcached ");
    //     callback(null, data);
    //   } catch(err){
    //     callback(err);
    //   }
    // }
    //else {
      var options = {
        url: path,
      };
      request(options, function(err, code, body){
        if(err){
          console.log(code, err, '***error***');
        }
        else {
          try {
            var htmlll = $.parseHTML(body);
            console.log(htmlll, 'htmlll');
    //         $(this).find('div').each(function() {
    //     console.log($(this).text());
    // });
            
            // server.set(path, JSON.stringify(res), 12*60*60, function(){
            //   console.log("data received from the web");
            //   callback(null, res);
            // });
          } catch(err) {
            callback(err);
          }
        }
      });
    }
  });
}

module.exports = makeTextRequest;