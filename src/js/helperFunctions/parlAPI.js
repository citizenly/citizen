var request = require("request");
var $ = require('jquery');
var cheerio = require('cheerio');
var server = require('../memcached.js');

function makeTextRequest(text, path, callback) {
  var key = path + text;
  server.get(key, function(err, data){
    if(data) {
      try {
        console.log(text +" - text received from memcached");
        text = JSON.parse(data);
        callback(null, text);
      } catch(err) {
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
      request(options, function(err, html){
        if(err){
          console.log(err);
        }
        else {
          try {
            $ = cheerio.load(html.body);
            if (text === "summary") {
              var summary = $("#publicationContent").children("div").eq(3).children("div").find("td[lang!='fr']");
              var summaryText = $.html(summary);
              server.set(key, JSON.stringify(summaryText), function(){
                console.log("summary text received from the web");
                callback(null, summaryText);
              }, 12*60*60);
            }
            else if (text === "full") {
              var fullContent = $("#publicationContent").children("div").eq(5).children("div").find("td[lang!='fr']");
              var fullContentText = $.html(fullContent);
              server.set(key, JSON.stringify(fullContentText), function(){
                console.log("full text received from the web");
                callback(null, fullContentText);
              }, 12*60*60);
            }
          } catch(err) {
            callback(err);
          }
        }
      });
    }
  });
}

module.exports = makeTextRequest;