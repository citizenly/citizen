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
      var user = new Parse.User();
      user.set("username", username);
      user.set("password", password);
      user.set("postalcode", userPostalCode);

      user.signUp(null,{
        success:function(user){
          console.log('SUCCESSFUL SIGNUP', user);
          event.emit('loggedIn');
          
          var repName = localStorage.getItem('repName');
          if (repName) {
            that.props.router.push('/rep/' + repName);
          }
          else {
            that.props.router.push('/');
          }
        },
        error:function(user,error){
          // Show the error message somewhere and let the user try again.
          alert("Error: " + error.code + " " + error.message);
        }
      });
    }
  },
  render: function() {
    return (
      <div className="formPage">
        <h1 className="formTitle">Signup</h1>
        <p>Already have an account? <Link to="/login">Login</Link></p>
        <form className="formEntryFields" method="post" onSubmit={this.handleSignup}>
            <input ref="firstname" className="firstname" type="text" name="firstname" maxLength="50" placeholder="first name" />
            <input ref="lastname" className="lastname" type="text" name="lastname" maxLength="50" placeholder="last name" />
            <input ref="username" className="username" type="text" name="username" maxLength="50" placeholder="username*" />
            <input ref="password" className="password" type="password" name="password" maxLength="50" placeholder="password*" />
            <input ref="postalcode" className={"postcodeinput " + this.state.invalidPostalCode } type="text" name="postalcode" maxLength="7" placeholder="postal code*" />
            <input ref="phone" className="phone" type="text" name="phone" maxLength="25" placeholder="phonenumber" />
            <div className= "disclaimerText">Please note that if you create or vote on a petition in 'Citizen' your name, city, country, postal code, and telephone number will be automatically added to that specific petition (this is required by the Government of Canada for valid petitions). By signing up to Citizen you're saying you agree to this.</div>
            <button className="formButton" type="submit">Sign up</button>
            <Message/>
        </form>
      </div>
    );
  }
});

module.exports = withRouter(Signup);