var React = require('react');
//var Link = require('react-router').Link;
import {Button, Icon, Input, Row, Col} from 'react-materialize';
var axios = require('axios');
var formattedPc = require("../helperFunctions/validatePc.js");
import { withRouter } from 'react-router'
var event = require('../events');
var Message = require('./InvalidPcMessage');


// home "page"
var Home = React.createClass({
  
  getInitialState: function () {
    return{
      invalidPostalCode: ""
    };
  },
  //we receive the postal code, we call formattedPc to be sure we have the valid format, we do an ajax call to the bakcend to fetch all the data of the MP and we set the postal code
  handleSubmit: function(e) {
    e.preventDefault();
    var that = this;
    var pc = this.refs.postalcode.value;
    var userPostalCode = formattedPc.validatePC(pc);
    if(userPostalCode === "invalid") {
        this.setState({invalidPostalCode: "alert"});
        event.emit('show_message', {message:"Please, enter a valid postal code"});
    }
    else {
      axios.post('/repnameget', {
        postalcode: userPostalCode
      }).then(function(response) {
        var path = '/rep/' + response.data;
        that.props.router.push(path);
      })
      .catch(function(response) {
        console.log(response, 'response');
      });
    }
  },
  render: function() {
    // user enters postalcode and rep's name is retrieved from Represent API - https://represent.opennorth.ca/api/
    return (
    <div className="main">
  
      <div className= "citizenlogo"> 
        <img src="images/citizenlogo.png"></img>
      </div>
      
      <div className="content">
        <div>
          <p>In a democracy, you elect someone to make decisions for you. Check out what they're doing in your name.</p>
        </div>
        <div>
          <p className="specialh1">WHO'S REPRESENTING ME?</p>
        </div>
      </div>
       
      <form onSubmit={this.handleSubmit}>
        <div>
          <input ref="postalcode" className={"postcodeinput " + this.state.invalidPostalCode } type="text" name="postalcode" maxLength="7" placeholder="enter your postal code" />
          <button className="postcodebutton" type="submit">FIND OUT</button>

        </div>
        <Message/>
      </form>
  
      <div> 
        <img className= "responsive-img" src="images/canadamap.png"></img>
      </div>
        
      </div>
  
    );
  }
});

//marker
module.exports = withRouter(Home);