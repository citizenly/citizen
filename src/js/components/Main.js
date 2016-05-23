var React = require('react');
var Link = require('react-router').Link;
var Message = require('./Message');

// The main application layout
// this.props.children will be set by React Router depending on the current route
var App = React.createClass({
  render: function() {
    return (
        <div>
          <header>
            <Message/>
              {/*Our menu for navigating around the app whilst developing*/}
              <nav className="mainMenu">
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/rep">Rep</Link>
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
                    <Link to="/rep">Rep Info</Link>
                  </li>
                  <li>
                    <Link to="/compare">Compare</Link>
                  </li>
                  <li>
                    <Link to="/petitions">Petitions</Link>
                  </li>
                  <li>
                    <Link to="/bills">Bills</Link>
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

module.exports = App;