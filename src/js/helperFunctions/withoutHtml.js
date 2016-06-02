/* global $ */

var cheerio = require("cheerio");
function withoutHtml(content) {
  
  $ = cheerio.load(content);
  
  var contentWithout = [];

  $('p').each(function(i, elem) {
    contentWithout[i] = $(this).text();
  });

  contentWithout = contentWithout.join(" ");

  return contentWithout;
}

module.exports = withoutHtml;