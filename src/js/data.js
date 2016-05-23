/* global localStorage */
var data = {};

function getData(key) {
  if(key){
    return data[key]
  } else {
    return data
  }
}

function setData(key, value) {
  data[key] = value;
  
  // this is optional. you could extend this to keep track of values across browsing sessions
  localStorage.setItem(key, JSON.stringify(value));
}

module.exports = {
  setData: setData,
  getData: getData
};