var React = require('react');
var Link = require('react-router').Link;
// required for ajax calls
//var axios = require('axios');
import { withRouter } from 'react-router';
//var event = require('../events');
var Parse = require('parse');

var User = Parse.Object.extend('User');

var Signup = React.createClass({
  handleSignup: function(e) {
    e.preventDefault();
    var that = this;
    var username = this.refs.username.value;
    var password = this.refs.password.value;

      User.set("username", that.refs.username.value);
      User.set("password", that.refs.password.value);
    
      User.signUp(null, {
        success: function(User) {
          // Hooray! Let them use the app now.
        },
        error: function(User, error) {
          // Show the error message somewhere and let the user try again.
          alert("Error: " + error.code + " " + error.message);
        }
      });
  },
  render: function() {
    return (
      <div>
        <h1>Signup</h1>
        
        <form onSubmit={this.handleSignup}>
        <div className="username">
          <input ref="username" className="username" type="text" name="username" maxLength="50" placeholder="please enter your username" />
          <input ref="password" className="password" type="text" name="password" maxLength="50" placeholder="please enter your password" />
          <button className="loginButton" type="submit">SIGNUP</button>
          
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </form>
      </div>
    );
  }
});

module.exports = withRouter(Signup);