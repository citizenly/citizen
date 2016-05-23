var React = require('react');
var Link = require('react-router').Link;

import {Button, Icon, Row, Col} from 'react-materialize';



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
        <p className="col s8 offset-s2 center-block">In a democracy, you elect someone to make decisions for you. Check out what they're doing in your name.</p>
        <div className= "col s8 offset-s2 center-block">
        <h1>WHO'S REPRESENTING ME?</h1>
        <form method="post">
          <input type="text" name="postalcode" placeholder="enter your postal code" value="" />
          <button onClick="" type="button" disabled="">Find Out</button>
        </form>
        </div>
        <div className="col s8 offset-s2 center-block"> 
          <span className="flow-text">
            <img className= "responsive-img" src="images/canadamap.png"></img>
          </span>
        </div>
      </div>
      </div>
    );
  }
});

module.exports = Home;