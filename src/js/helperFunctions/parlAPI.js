var request = require("request");
//var $ = require('jquery');
var memcached = require('memcached');
var server = new memcached('localhost:11211');
var cheerio = require('cheerio');
//var util = require("util");


function makeTextRequest(text, path, callback) {
  //server.get(path, function(err, data){
    // if(data){
    //   try {
    //     data = JSON.parse(data);
    //     console.log("data received from memcached ");
    //     callback(null, data);
    //   } catch(err){
    //     callback(err);
    //   }
    // }
    // else {
      var options = {
        url: path,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1'
        }
      };
      request(options, function(err, response, html){
        if(err){
          console.log(err, '***error***');
        }
        else {
          $ = cheerio.load(html);
          if (text === "summary") {
            var summary = $("#publicationContent").children("div").eq(3).children("div").find("td[lang!='fr']")
            
            callback($.html(summary));
          }
          else if (text === "full") {
            var fullContent = $("#publicationContent div:last-child[lang!='fr']");
            callback($.html(fullContent));
          }
        }
      });
   // }
 // });
}

module.exports = makeTextRequest;