// The package "should" must be installed:   
// `npm install should`

var parse = require("csv-parse");
var election = require("../assets/table_tableau12.csv");
//require('should');


parse(election, function(err, data){
    if(err) throw err;
    else {
      console.log(data);
    }
    
    });


// parse(
//   'ColumnOne,ColumnTwo\nfirst,Data\nsecond,MoreData',
//   {'columns':true, 'objname': "ColumnOne"},
//   function(err, data){
//     if(err) throw err;
//     data.should.eql({
//       first: { ColumnOne: 'first', ColumnTwo: 'Data' },
//       second: { ColumnOne: 'second', ColumnTwo: 'MoreData' } 
//     });
//   }
// );