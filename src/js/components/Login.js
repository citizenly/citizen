var React = require('react');
var Link = require('react-router').Link;
// required for ajax calls
//var axios = require('axios');
import { withRouter } from 'react-router';
//var event = require('../events');


var Login = React.createClass({
  handleLogin: function(e) {
    e.preventDefault();
    
  },
  render: function() {
    return (
      <div>
        <h1>LOGIN</h1>
        
        <form onSubmit={this.handleLogin}>
        <div className="username">
          <input ref="username" className="username" type="text" name="username" maxLength="50" placeholder="please enter your username" />
          <input ref="password" className="password" type="text" name="password" maxLength="50" placeholder="please enter your password" />
          <button className="loginButton" type="submit">LOGIN</button>
          
          <p>Don't have an account? <Link to="/signup">Signup for one</Link></p>
        </div>
      </form>
      </div>
    );
  }
});

module.exports = withRouter(Login);