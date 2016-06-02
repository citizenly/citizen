var makeRequest = require("./openAPI.js");
var withoutHtml = require("./withoutHtml.js");
var moment = require('moment');

/* For each politician, we can get what they are doing by their speeches in the House, their tweeter feed or their ballots
For each of this three sources, we will get an array of objects. Each of these objects will have a date to clasify
 them from the most recent to the oldest.  After that, we will do section: yesterday, two days ago, later this week and one week ago
 
 */
// By speeches: https://api.openparliament.ca/speeches/?politician=marc-miller&limit=500&format=json
/*we want to construct an object with:
where: in the House or at a comittee
on: subject
content: english content (maybe only the first 200 characters)
date: date and time (to keep only one by day)
*/
function getOneSpeechInTheHouseByDayAndRep(rep, callback) {
  var path = `speeches/?politician=${rep}&limit=40`;
  // Make request to api.openparliament.ca and cache
  makeRequest(path, function(err, res){
    if(err){
      callback(err);
    }
    else {
      //speeches is an aray of all the speeches as object
      //Only the speeches in the House have an h1 propriety(so, as where value, they will recive "in the House") 
      //and h2 propriety(that means the subject)
      //For the moment, we keep only the speeches in the House as an array
    
      var speechesInTheHouse = [];
      var speechesAtCommittee = [];
      var speeches = res.objects;
      speeches.forEach(function(speech){
        var theHouse = speech.h1;
        var theSpeech = {};
        if(theHouse){
          theSpeech.where = "in the House";
          theSpeech.on = speech.h2.en;
          theSpeech.content = withoutHtml(speech.content.en.substring(0, 250));
          theSpeech.contentUrl = `https://openparliament.ca${speech.url}`;
          theSpeech.date = speech.time;
          speechesInTheHouse.push(theSpeech);
        }
        else{
          theSpeech.where = speech.document_url; //will give something like that "/committees/finance/42-1/23/", 
          speechesAtCommittee.push(theSpeech);
        }
      });
      
    //We filter our array of speeches to classify each speech by its date
      var speechesByDate = {};
      var listOfFirstSpeechByDate = [];
      speechesInTheHouse.filter(function(speech){
        speechesByDate[speech.date] = speechesByDate[speech.date] || [];
        speechesByDate[speech.date].push(speech);
      });
      
      /*In the new object, each propriety name is the date of the speech 
      and its value is an array of all the speeches of this particular day.
      We compare their date to keep only the first speech.
      */
      for (var date in speechesByDate) {
        var firstSpeech = speechesByDate[date].reduce(function(prev, next) {
          var x = new Date(prev.date);
          var y = new Date(next.date);
          if (x > y) {
            return next;
          }
          else {
            return prev;
          }
        });
        listOfFirstSpeechByDate.push(firstSpeech);
      }
      callback(null, listOfFirstSpeechByDate);
    }
  });
}

//We display the feed by date : yesterday, two days ago, this week, last week
//We create an object where its propriety names are the time ago and their value the object of the speech for this day

function when(listOfFirstSpeechByDate) {
  var when = {};
  
  listOfFirstSpeechByDate.forEach(function(speech){
    var date = speech.date.split(" ")[0];
    var difference = moment(date).fromNow();
    
    when[difference.replace(/\s/g, '')] = when[difference.replace(/\s/g, '')] || [];
    when[difference.replace(/\s/g, '')].push(speech);
  });
  //console.log(when['3daysago'])
  return when;
}

module.exports = {
  getOneSpeechInTheHouseByDayAndRep: getOneSpeechInTheHouseByDayAndRep,
  when: when
};


// getOneSpeechInTheHouseByDayAndRep("marc-garneau", function(err, listOfFirstSpeechByDate){
//   if(err) {
//     console.log(err);
//     return;
//   }
//   when(listOfFirstSpeechByDate);
// })