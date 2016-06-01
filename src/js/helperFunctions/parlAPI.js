var request = require("request");
var $ = require('jquery');
var memcached = require('memcached');
var server = new memcached('localhost:11211');
var cheerio = require('cheerio');
//var util = require("util");


function makeTextRequest(text, path, callback) {
  server.get(path, function(err, data){
    if(data) {
      try {
        console.log("bill text received from memcached ");
        callback(null, data);
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
              console.log("bill text received from the web");
              callback(null, summaryText);
            }
            else if (text === "full") {
              //var fullContent = $("#publicationContent div:last-child[lang!='fr']");
              var fullContent = $("#publicationContent").children("div").eq(5).children("div").find("td[lang!='fr']");
              var fullContentText = $.html(fullContent);
              console.log("bill text received from the web");
              //console.log(fullContentText);
              callback(null, fullContentText);
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