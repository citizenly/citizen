
var request = require("request");
var unaccented = require("./src/js/helper-function/unaccented.js");
var percentageVotes = require("./src/js/helper-function/percentageVotes.js");

//The user input his postal code.  With this data, we request the name of his MP

//We have to validate that the postal code is all upperCase, that it has only 6 characters without white space and that these characters follow LNL NLN
//inside react, this coulb be an handleResult function 
function handelResult (postalCode) {
  var rep = {};
  postalCode.toUpperCase().replace(/\s+/g, "");
    if(postalCode.length !== 6){
      return "invalid postal code";
    }
    else{
      var valid = /([ABCEGHJKLMNPRSTVXY]\d)([ABCEGHJKLMNPRSTVWXYZ]\d){2}/i;
      var ok = valid.test(postalCode);
      if(!ok){
        return "invalid postal code";
      }
      else{
        //At this point, we have a valid postal code, so we look for the name of the MP
        var findMPbyPC = `http://represent.opennorth.ca/postcodes/${postalCode}/?sets=federal-electoral-districts`;
        console.log(findMPbyPC);
        request(findMPbyPC, function(err, result) {
          if(err){
            
          }
          else{
            var mpName = JSON.parse(result.body);
            var name = mpName.representatives_centroid[0].name;
            console.log(name, "name line 49");
            //we have to formatted the name to be sure that is all lowercase, without accent and with a dash between firstname and lastname
            var nameFormatted = unaccented.unaccented(name); 
            // console.log(nameFormatted, "nameFormatted line 52");
            //with the name of MP formatted, we fetch his data
            var findMP = `https://api.openparliament.ca/politicians/${nameFormatted}/?format=json`;
            request(findMP, function(err, result) {
              var mp = JSON.parse(result.body);
              var constituency = mp.memberships[0].riding.name.en;
              var party = mp.memberships[0].party.short_name.en;
              var image = "https://api.openparliament.ca" + mp.image;
              var electedOn = mp.memberships[0].start_date.substring(0,4);
              var ridingId = mp.memberships[0].riding.id;
              var favoriteWord = mp.other_info.favourite_word[0];
              var province = mp.memberships[0].riding.province;
              
              rep = {
                name: name,
                constituency: constituency,
                province: province,
                party: party,
                img: image,
                electedYear:electedOn,
                electedVote: ''
              };
              return rep;
              //console.log (rep);
            });
            console.log (rep);
          }
          
        });
      }
    }  
    //console.log (rep);
}

       
function handlePercentageVote(ridingId, callback){
    percentageVotes.percentageVotes(ridingId, function(r){
      callback(r);
    })  
}

// handlePercentageVote(121312, function (r) {
 
//   //PUT ALL LOGIC HERE
// })

 handelResult('H4R1E9');



