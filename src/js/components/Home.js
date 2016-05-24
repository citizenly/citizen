var React = require('react');
var Link = require('react-router').Link;

import {Button, Icon, Input, Row, Col} from 'react-materialize';



// home "page"
var Home = React.createClass({
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
        <form method="post">
          <div className="col s10 center-block flow-text">
          <input className="postcodeinput" type="text" name="postalcode" placeholder="enter your postal code" value="" />
          <button className="postcodebutton" onClick="" type="button" disabled="">FIND OUT</button>
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