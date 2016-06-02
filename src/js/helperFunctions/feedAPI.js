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
  
  console.log(rep, "REP")
  var path = `speeches/?politician=${rep}&limit=100`;
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
          theSpeech.type = "speech"
          theSpeech.where = "in the House";
          theSpeech.on = speech.h2.en;
          theSpeech.content = withoutHtml(speech.content.en.substring(0, 250));
          theSpeech.contentUrl = `https://openparliament.ca${speech.url}`;
          theSpeech.date = speech.time.split(" ")[0];
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
            return prev;
          }
          else {
            return next;
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

function filterFeedByMoment(listOfFirstSpeechByDate, ballotsAboutFinaleStageBill) {
  var today = moment().format("YYYY-MM-DD");
  var yesterday = moment().subtract(1, 'days').format("YYYY-MM-DD");
  var twoDaysAgo = moment().subtract(2, 'days').format("YYYY-MM-DD"); 
  var startThisWeek = moment().startOf('week').format("YYYY-MM-DD");
  //this two variable can be true or false
  var isThisWeek = function(date,startThisWeek, twoDaysAgo){
    return moment(date).isBetween(startThisWeek, twoDaysAgo);
  };
  var isLastWeek = function(date, startThisWeek){
    var startLastWeek = moment(startThisWeek).subtract(8, 'days').format("YYYY-MM-DD");
    return moment(date).isBetween(startLastWeek, startThisWeek);
  };
  var feeds = {yesterday: [], twoDaysAgo: [], thisWeek: [], lastWeek: []};
  
  listOfFirstSpeechByDate.forEach(function(speech){
    var date = speech.date;
    
    if(date === yesterday){
      feeds.yesterday.push(speech);
      return;
    }
    if(date === twoDaysAgo){
      feeds.twoDaysAgo.push(speech);
      return;
    }
    if(isThisWeek(date, startThisWeek, twoDaysAgo)){
      feeds.thisWeek.push(speech);
      return;
    }
    if(isLastWeek(date, startThisWeek)){
    feeds.lastWeek.push(speech);
    return;
    }
  });
  
  ballotsAboutFinaleStageBill.forEach(function(ballot){
    var date = ballot.dateOfVote;
    
    if(date === yesterday){
      feeds.yesterday.push(ballot);
      return;
    }
    if(date === twoDaysAgo){
      feeds.twoDaysAgo.push(ballot);
      return;
    }
    if(isThisWeek(date, startThisWeek, twoDaysAgo)){
      feeds.thisWeek.push(ballot);
      return;
    }
    if(isLastWeek(date, startThisWeek)){
    feeds.lastWeek.push(ballot);
    return;
    }
  });
  return feeds;
}
   
  
module.exports = {
  getOneSpeechInTheHouseByDayAndRep: getOneSpeechInTheHouseByDayAndRep,
  filterFeedByMoment: filterFeedByMoment
};

