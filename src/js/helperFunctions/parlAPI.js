var request = require("request");
var $ = require('jquery');
var memcached = require('memcached');
var server = new memcached('localhost:11211');

function makeTextRequest(path, callback) {
  // server.get(path, function(err, data){
  //   //if(data){
  //   //   try {
  //   //     data = JSON.parse(data);
  //   //     console.log("data received from memcached ");
  //   //     callback(null, data);
  //   //   } catch(err){
  //   //     callback(err);
  //   //   }
  //   // }
  //   //else {
  //     var options = {
  //       url: path,
  //     };
  //     request(options, function(err, body){
  //       if(err){
  //         console.log(err, '***error***');
  //       }
  //       else {
  //         try {
  //           var html = $.parseHTML(body);
  //           console.log(html, 'html');
  //   //         $(this).find('div').each(function() {
  //   //     console.log($(this).text());
  //   // });
            
  //           // server.set(path, JSON.stringify(res), 12*60*60, function(){
  //           //   console.log("data received from the web");
  //           //   callback(null, res);
  //           // });
  //         } catch(err) {
  //           callback(err);
  //         }
  //       }
  //     });
  //   //}
  // });
}

// makeTextRequest ("http://www.parl.gc.ca/HousePublications/Publication.aspx?Language=E&Mode=1&DocId=8266110&Col=1", function(billSummary) {
//   console.log(billSummary, 'billSummary');
// });

//module.exports = makeTextRequest;