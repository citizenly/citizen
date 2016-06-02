/* global localStorage */
var React = require('react');
var Link = require('react-router').Link;
// required for ajax calls
//var axios = require('axios');
import { withRouter } from 'react-router';
//var event = require('../events');
var Parse = require('parse');
var event = require('../events.js');

var Login = React.createClass({
  handleSignup: function(e) {
    e.preventDefault();
    var that = this;
    var username = this.refs.username.value;
    var password = this.refs.password.value;

      Parse.User.logIn(username, password).then(
        function(user) {
          console.log('SUCCESSFUL LOGIN', user);
          event.emit('loggedIn');
          
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
  },
  render: function() {
    return (
      <div className="formPage">
        <h1 className="formTitle">Login</h1>
        <p>Don't have an account? <Link to="/signup">Signup</Link></p>
        <form className="formEntryFields" method="post" onSubmit={this.handleSignup}>
            <input ref="username" className="username" type="text" name="username" maxLength="50" placeholder="username" />
            <input ref="password" className="password" type="text" name="password" maxLength="50" placeholder="password" />
            <button className="formButton" type="submit">LOGIN</button>
        </form>
      </div>
    );
  }
});

module.exports = withRouter(Login);