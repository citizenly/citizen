var React = require('react');
//var Link = require('react-router').Link;
import {Button, Icon, Input, Row, Col} from 'react-materialize';
var axios = require('axios');
var formattedPc = require("../helperFunctions/validatePc.js");
import { withRouter } from 'react-router'
var event = require('../events');



// home "page"
var Home = React.createClass({
  
  getInitialState: function () {
    return{
      invalidPostalCode: ""
    };
  },
  //we receive the postal code, we call formattedPc to be sure we have the valid format, we do an ajax call to the bakcend to fetch all the data of the MP and we set the postal code
  handleSubmit: function(e) {
    var that = this;
    var pc = this.refs.postalcode.value;
    var userPostalCode = formattedPc.validatePC(pc);
    if(userPostalCode === "invalid") {
      if(this.state.invalid.length === 0) {
        this.setState({invalidPostalCode: "alert"});
        event.emit('show_message', {message:"Please, enter a valid postal code", duration: 2000});
      }
      else{
        this.setState({invalidPostalCode: ""});
      }
    }
    else {
      e.preventDefault();
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
        <form onSubmit={this.handleSubmit}>
          <div className="col s10 center-block flow-text">
            <input ref="postalcode" className={"postcodeinput " + this.state.invalidPostalCode} type="text" name="postalcode" placeholder="enter your postal code" />
            <button className="postcodebutton" type="submit" maxLength="7">FIND OUT</button>
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

module.exports = withRouter(Home);