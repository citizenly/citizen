var React = require('react');
var Link = require('react-router').Link;
var IndexLink = require("react-router").IndexLink;
import { withRouter } from 'react-router';

// The main application layout
// this.props.children will be set by React Router depending on the current route

var App = React.createClass({
  getInitialState: function () {
    return{
      menutoggle: ''
    };
  },
  
  onComponentDidMount: function () {
   this.setState({menutoggle:''});
  },
  
  onClick: function (e) {
    e.preventDefault();
    if (this.state.menutoggle.length === 0) {
      this.setState({menutoggle:'slide-down'});
    }
    else {
      this.setState({menutoggle:''});
    }
  },
  
  
    onMenuItemClick: function (e) {
      this.setState({menutoggle:''});
  },
  
  render: function() {
    return (
      <div>
        <header>
          <nav>
          <div className="hamburgerDiv">
            <a href="#" onClick={this.onClick} className="hamburger">
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
            </a>
          </div>
            <ul className={"clearfix menu " + this.state.menutoggle} >
              <li>
                <IndexLink activeClassName="active" onClick={this.onMenuItemClick} to="/">Home</IndexLink>
              </li>
              <li>
                <Link activeClassName="active" onClick={this.onMenuItemClick} to="/login">Login</Link>
              </li>
              <li>
                <Link activeClassName="active" onClick={this.onMenuItemClick} to="/about">About</Link>
              </li>
              <li>
                <Link activeClassName="active" onClick={this.onMenuItemClick} to="/rep">Your Representative</Link>
              </li>
              <li>
                <Link className="whatWouldYouDoMenu" activeClassName="active" onClick={this.onMenuItemClick} to ="/bills/active">What would you do?</Link>
              </li>
              <li>
                <Link className="whatTheyreDoingMenu" activeClassName="active" onClick={this.onMenuItemClick} to="/feed">What they're doing</Link>
              </li>
              <li>
                <Link activeClassName="active" className="petitionsMenu" onClick={this.onMenuItemClick} to="/petitions">Petitions</Link>
              </li>
              <li>
                <Link activeClassName="active" className="compareMenu" onClick={this.onMenuItemClick} to="/compare">Compare</Link>
              </li>
            </ul>
          </nav>
        </header>

        <div className="site-wrap">
          <main>{this.props.children}</main>
        </div>
      </div>
    );
  }
});


module.exports = withRouter(App);