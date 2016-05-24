/*We have to validate that the postal code is all upperCase, 
that it has only 6 characters without white space nor dash
and that these characters follow LNL NLN
*/

function validatePC(postcode) {
  var pc = postcode.toUpperCase().replace(/\s+/g, "");
  pc = pc.replace(/\-/g, "");
  if(pc.length !== 6){
    return "invalid postal code";
  }
  else {
    var valid = /([ABCEGHJKLMNPRSTVXY]\d)([ABCEGHJKLMNPRSTVWXYZ]\d){2}/i;
    var ok = valid.test(pc);
    if (!ok){
      return "invalid postal code";
    }
    else{
      return pc;
    }
  }
}

module.exports = {
  validatePC: validatePC
};