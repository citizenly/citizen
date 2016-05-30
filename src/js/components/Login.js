var React = require('react');
var Link = require('react-router').Link;
// required for ajax calls
//var axios = require('axios');
import { withRouter } from 'react-router';
//var event = require('../events');
var Parse = require('parse');

var Login = React.createClass({
  handleSignup: function(e) {
    e.preventDefault();
    var that = this;
    var username = this.refs.username.value;
    var password = this.refs.password.value;

      Parse.User.logIn(username, password).then(
        function(user) {
          console.log('SUCCESSFUL LOGIN', user);
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
      <div>
        <h1>Login</h1>
        
        <form onSubmit={this.handleSignup}>
        <div className="username">
          <input ref="username" className="username" type="text" name="username" maxLength="50" placeholder="please enter your username" />
          <input ref="password" className="password" type="password" name="password" maxLength="50" placeholder="please enter your password" />
          <button className="loginButton" type="submit">LOGIN</button>
          
          <p>Don't have an account? <Link to="/signup">Signup for one</Link></p>
        </div>
      </form>
      </div>
    );
  }
});

module.exports = withRouter(Login);