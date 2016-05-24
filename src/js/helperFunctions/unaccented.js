var unaccented = function (name) {

  //This function checks if the letter is accented. If it's the case, it replaced by its unaccented version           
  function convert(letter) {
    switch (letter) {
      case "à":
        return "a";
        break;
      case "â":
        return "a";
        break;
      case "ä":
        return "a";
        break;
      case "é":
        return "e";
        break;
      case "è":
        return "e";
        break;
      case "ê":
        return "e";
        break;
      case "ë":
        return "e";
        break;
      case "î":
        return "i";
        break;
      case "ï":
        return "i";
        break;
      case "ö":
        return "o";
        break;
      case "ô":
        return "o";
        break;
      case "ù":
        return "u";
        break;
      case "ü":
        return "u";
        break;
      default:
        return;
    }
  }

  var accents = ["à", "â", "ä", "é", "è", "ê", "ë", "î", "ï", "ö", "ô", "ù", "û"];
  /*We transform the string in an array of letters and then map over each of them. 
  For each letter, we map over the accents array to see if the letter match any accented one  */
  var splitName = name.split("");
  splitName.forEach(function(letter, i) {
    var convertedLetter;
    var foundAtIndex;
    accents.forEach(function(accent) {
      //If we find a letter matching an accented one, we call the convert function and assign its position to the foundAtIndex variable              
      if (letter === accent) {
        convertedLetter = convert(letter);
        foundAtIndex = i;
      }
    });
    //If convertedLetter and foundAtIndex variable is not null, at the index in the splitName array where is an accented letter, we replace it by the unaccented one            
    if (convertedLetter && foundAtIndex) {
      splitName[foundAtIndex] = convertedLetter;
    }
  });

  var nameFormatted = splitName.join("").toLowerCase().replace(/\s+/g, "-");
  return nameFormatted;
};

module.exports = {
  unaccented: unaccented
};