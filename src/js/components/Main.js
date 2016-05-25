var React = require('react');
var Link = require('react-router').Link;
var IndexLink = require("react-router").IndexLink;
import { withRouter } from 'react-router';

// The main application layout
// this.props.children will be set by React Router depending on the current route
var App = React.createClass({
  render: function() {
    return (
        <div>
          <header>
              {/*Our menu for navigating around the app whilst developing*/}
              <nav className="mainMenu">
                <ul>
                  <li>
                    <IndexLink activeClassName="active" to="/">Home</IndexLink>
                  </li>
                  <li>
                    <Link activeClassName="active" to="/rep">Rep</Link>
                  </li>
                </ul>
              </nav>
              
              {/*Actual menu*/}
              <nav className="mainMenu">
                <ul>
                  <li>
                    Login/Signup
                  </li>
                  <li>
                    <Link activeClassName="active" to="/rep">Rep Info</Link>
                  </li>
                  <li>
                    <Link activeClassName="active" to="/compare">Compare</Link>
                  </li>
                  <li>
                    <Link activeClassName="active" to="/petitions">Petitions</Link>
                  </li>
                  <li>
                    <Link activeClassName="active" to="/bills">Bills</Link>
                  </li>
                  <li>
                    Settings
                  </li>
                </ul>
              </nav>
          </header>
          <main>{this.props.children}</main>
        </div>
    );
  }
});

module.exports = withRouter(App);