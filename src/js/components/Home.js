var React = require('react');
//var Link = require('react-router').Link;
import {Button, Icon, Input, Row, Col} from 'react-materialize';
var axios = require('axios');
//var EventEmitter = require("../events.js");
var data = require("../data");
var formattedPc = require("../helperFunctions/validatePc.js");

var userPostalCode = "";

// home "page"
var Home = React.createClass({
  
  //we recive the postal code, we call formattedPc to be sure to have the valid format, we do an ajax call to the bakcend to fetch all the data of the PM and we set the postal code
  handleSubmit: function(e){
    var that = this;
    var pc = this.refs.postalcode.value;
    var userPostalCode = formattedPc.validatePC(pc);
    e.preventDefault();
    axios.get('/repget', {
    postalcode: userPostalCode
  })
  .then(function (response) {
    data.setData('rep', response.data);
    that.props.history.push('/rep');
  })
  .catch(function (response) {
    console.log(response);
  });
  },
  render: function() {
    // user enters postalcode and rep's name is retrieved from Represent API - https://represent.opennorth.ca/api/
    return (
    <div className="main container center-block">
      
        <div className="row">
        
            <div className="col s4 offset-s4"> 
               <img className= "citizenlogo responsive-img" src="images/citizenlogo.png"></img>
            </div>
            
            <div className="col s12 flow-text">
                <p className="col s12 flow-text">In a democracy, you elect someone to make decisions for you. Check out what they're doing in your name.</p>
            </div>
            
            <div className="col s12">
                <p className="specialh1">WHO'S REPRESENTING ME?</p>
            </div>
        </div>

        <p className="col s8 offset-s2 center-block flow-text">In a democracy, you elect someone to make decisions for you. Check out what they're doing in your name.</p>
        <div className="col s8 offset-s2 center-block flow-text">
        <p className="specialh1 flow-text">WHO'S REPRESENTING ME?</p>
        <form>
          <div className="col s10 center-block flow-text">
          <input ref="postalcode" className="postcodeinput" type="text" name="postalcode" placeholder="enter your postal code" />
          <button className="postcodebutton" onClick={this.handleSubmit} type="button">FIND OUT</button>
          </div>
        </form>
        </div>
        
        <div className="col s8 offset-s2 center-block"> 
            <img className= "responsive-img" src="images/canadamap.png"></img>
        </div>
        
    </div>
      
    );
  }
});

module.exports = Home;