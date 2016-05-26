var makeRequest = require("./open-API");

makeRequest("bills/?limit=100", function(err, bills){
    console.log(err, bills);
})