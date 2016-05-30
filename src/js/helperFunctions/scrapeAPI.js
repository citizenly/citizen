var request = require("request");
// cheerio required for website scraping / parsing the html returned
//var cheerio = require('cheerio');
var makeTextRequest = require("./parlAPI.js");


// Function is passed bill url on parl.gc.ca and cherrio scrapes the data
function getBillSummary (path, callback) {
  makeTextRequest(path, function(err, billSummary){
    if (err) {
      callback(err);
    }
    else {
      callback(null, billSummary);
    }
  });
}  

//module.exports = {
//   getBillSummary: getBillSummary,
//   getBillText: getBillText
// };

/* TEST FUNCTIONS ----------------------------------------------------------- */

getBillSummary ("http://www.parl.gc.ca/HousePublications/Publication.aspx?Language=E&Mode=1&DocId=8266110&Col=1", function(err, billSummary) {
  console.log(err, 'err');
  console.log(billSummary, 'billSummary');
});