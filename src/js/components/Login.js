/* global localStorage */
var React = require('react');
var axios = require('axios');
import { withRouter } from 'react-router';
var formattedPc = require("../helperFunctions/validatePc.js");
var event = require('../events');
var Message = require('./InvalidPcMessage');


var Login = React.createClass({
  getInitialState: function () {
    return{
      invalidPostalCode: ""
    };
  },
  //we receive the postal code, we call formattedPc to be sure it is in a valid format, we do an ajax call to the backend, sending it a valid postal code and fetching the appropriate formatted MP name
  handleSubmit: function(e) {
    e.preventDefault();
    var that = this;
    
    // check if the postal code is in a valid format
    var pc = this.refs.postalcode.value;
    var userPostalCode = formattedPc.validatePC(pc);
    console.log('HERE', userPostalCode);
    
    // show an error message if the user has not entered a postal code in a valid format
    if (userPostalCode === "invalid") {
      this.setState({invalidPostalCode: "alert"});
      event.emit('show_message', {message:"Enter a valid postal code"});
    }
    
    
    // send the server a valid postal code and fetch the appropriate formatted MP name
    else {
      axios.post('/repnameget', {
        postalcode: userPostalCode
      })
      .then(function(response) {
        //this needs adapting, not doing anything right now
        if(response.data === "invalid") {
          that.setState({invalidPostalCode: "alert"});
          event.emit('show_message', {message:"There is no constituency associated with your postal code."});  
        }
        else {
          var repName = response.data.allRepData.full_name.replace(" ","-").toLowerCase();
          var path = '/rep/' + repName;
          // store 'repName' in the browser cache
          console.log("RESPONSE", response)
          localStorage.setItem('repName', response.data.allRepData);

          // redirect to the path of rep/your-rep-name
          // that.props.router.push(path);
          that.props.router.push({
            pathname: path,
            state: {allRepData: response.data.allRepData}
          });
        }
      })
      .catch(function(response) {
        console.log(response, 'response');
      });
    }
  },
  render: function() {
    // user enters postalcode and rep's name is retrieved from Represent API - https://represent.opennorth.ca/api/
    return (
    <div>
      <img alt="" src="images/uk-map.png" className="bg-image"></img>
      
      <div className="login-page">
        <div className= "citizenlogo"> 
          <img alt="citizen app logo" src="images/citizenlogo.png"></img>
        </div>
        
        <div className="intro">
            <p>In a democracy you elect someone to make decisions for you. 
            <br/>Find out what they're currently doing in your name.</p>
            <h1>WHO'S REPRESENTING ME?</h1>
            <h3>UK</h3>
        </div>
         
        <form onSubmit={this.handleSubmit}>
          <div className="postcodeinputandentry">
            <div className="login-field">
              <input ref="postalcode" className={"postcodeinput " + this.state.invalidPostalCode } type="text" name="postalcode" maxLength="7" placeholder="enter your postal code (eg. BS3 1QP)" />
            </div>
            <div className="login-field">
              <button className="postcodebutton" type="submit">FIND OUT</button>
            </div>
          <Message/>
          </div>
        </form>
       </div>   
      </div>
    );
  }
});

//marker
module.exports = withRouter(Login);


      // <div className= "canadamap"> 
      //   <img alt="canada map" src="images/canadamap.png"></img>
      // </div>