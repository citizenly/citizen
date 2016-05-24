var React = require('react');
var Link = require('react-router').Link;
var IndexLink = require("react-router").IndexLink;
var Message = require('./Message');

// The main application layout
// this.props.children will be set by React Router depending on the current route
var App = React.createClass({
  render: function() {
    return (
        <div>
              <nav className="mainMenu">
                <ul class="navigation">
                  <li class="nav-item">
                    <IndexLink activeClassName="active" to="/">**HOME - just for us now**</IndexLink>
                  </li>
                  <li class="nav-item">
                    <Link activeClassName="active" to="/login">LOGIN</Link>
                  </li>
                  <li class="nav-item">
                    <Link activeClassName="active" to="/rep">YOUR REPRESENTATIVE</Link>
                  </li>
                  <li class="nav-item">
                    <Link activeClassName="active" to="/bills">WHAT WOULD YOU DO?</Link>
                  </li>
                  <li class="nav-item">
                    <Link activeClassName="active" to="/feed">WHAT THEY'RE DOING</Link>
                  </li>
                  <li class="nav-item">
                    <Link activeClassName="active" to="/petitions">PETITIONS</Link>
                  </li>
                  <li class="nav-item">
                    <Link activeClassName="active" to="/compare">COMPARE</Link>
                  </li>
                </ul>
              </nav>
          
              <input type="checkbox" id="nav-trigger" class="nav-trigger" />
              <label for="nav-trigger"></label>
          

              <div class="site-wrap">
                <main>{this.props.children}</main>
              </div>
        </div>
    );
  }
});

module.exports = App;
