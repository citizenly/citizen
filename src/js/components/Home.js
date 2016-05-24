var React = require('react');
//var Link = require('react-router').Link;
import {Button, Icon, Input, Row, Col} from 'react-materialize';
var axios = require('axios');
//var EventEmitter = require("../events.js");
var data = require("../data");

// home "page"
var Home = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();
    axios.post('/rep', {
    postalcode: this.refs.postalcode.value
  })
  .then(function (response) {
    data.setData('rep', response.data);
  })
  .catch(function (response) {
    console.log(response);
  });
  },
  render: function() {
    // user enters postalcode and rep's name is retrieved from Represent API - https://represent.opennorth.ca/api/
    return (
      <div className="main container center-block">
       <div className="row center-block">
        <div className="col s4 offset-s4 center-block"> 
            <img className= "responsive-img" src="images/citizenlogo.png"></img>
        </div>
        <p className="col s8 offset-s2 center-block flow-text">In a democracy, you elect someone to make decisions for you. Check out what they're doing in your name.</p>
        <div className="col s8 offset-s2 center-block flow-text">
        <p className="specialh1 flow-text">WHO'S REPRESENTING ME?</p>
        <form>
          <div className="col s10 center-block flow-text">
          <input ref="postalcode" className="postcodeinput" type="text" name="postalcode" placeholder="enter your postal code" />
          <button className="postcodebutton" onClick={this.handleSubmit} type="button" disabled="">FIND OUT</button>
          </div>
        </form>
        </div>
        <div className="col s8 offset-s2 center-block"> 
            <img className= "responsive-img" src="images/canadamap.png"></img>
        </div>
      </div>
      </div>
    );
  }
});

module.exports = Home;