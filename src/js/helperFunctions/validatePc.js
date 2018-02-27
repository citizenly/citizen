/*We have to validate that the postal code is all upperCase, 
that it has only 6 characters without white space nor dash
and that these characters follow LNL NLN and have the valide letters
*/

function validatePC(postcode) {
var pc = postcode.toUpperCase().replace(/\s+/g, "");
pc = pc.replace(/\-/g, "");
  var valid = /[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}/i; 
  var ok = valid.test(pc);
  if (!ok){
    return "invalid";
  }
  else{
    return pc;
  }
}

module.exports = {
  validatePC: validatePC
};
