/* global localStorage */

var React = require('react');
var Link = require('react-router').Link;
// required for ajax calls
//var axios = require('axios');
var formattedPc = require("../helperFunctions/validatePc.js");
import { withRouter } from 'react-router';
var event = require('../events');
var Message = require('./InvalidPcMessage');
//var event = require('../events');
var Parse = require('parse');

var Signup = React.createClass({
  getInitialState: function() {
    return {
      invalidPostalCode: ""
    };
  },
  handleSignup: function(e) {
    e.preventDefault();
    var that = this;
    var username = this.refs.username.value;
    var password = this.refs.password.value;
    
    // check postal code is valid
    var pc = this.refs.postalcode.value;
    var userPostalCode = formattedPc.validatePC(pc);
    
    // show error msg if invalid postal code is entered
    if(userPostalCode === "invalid") {
      this.setState({invalidPostalCode: "alert"});
      event.emit('show_message', {message:"Enter a valid postal code"});
    }
    else {
      // signup new user using Parse
      Parse.User.signUp(username, password).then(
        function(user) {
          console.log('SUCCESSFUL SIGNUP', user);
          var repName = localStorage.getItem('repName');
          if (repName) {
            that.props.router.push('/rep/' + repName);
          }
          else {
            that.props.router.push('/');
          }
        },
        function(error) {
          // Show the error message somewhere and let the user try again.
          alert("Error: " + error.code + " " + error.message);
        }
      );
    }
  },
  render: function() {
    return (
      <div>
        <h1>Signup</h1>
        
        <form onSubmit={this.handleSignup}>
        <div className="username">
          <input ref="username" className="username" type="text" name="username" maxLength="50" placeholder="please enter your username" />
          <input ref="password" className="password" type="password" name="password" maxLength="50" placeholder="please enter your password" />
          <input ref="postalcode" className={"postcodeinput " + this.state.invalidPostalCode } type="text" name="postalcode" maxLength="7" placeholder="enter your postal code" />
          <p> In order for you to be able to create valid petitions, we also need the following information (as defined by the Government of Canada): </p>
          <input ref="city" className="city" type="text" name="city" maxLength="15" placeholder="your city" />
          <input ref="country" className="country" type="text" name="country" maxLength="15" placeholder="your country (probably Canada)" />
          <input ref="phone" className="phone" type="text" name="phone" maxLength="25" placeholder="your phonenumber" />

  
          <button className="loginButton" type="submit">SIGNUP</button>
          <Message/>
          
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </form>
      </div>
    );
  }
});

module.exports = withRouter(Signup);