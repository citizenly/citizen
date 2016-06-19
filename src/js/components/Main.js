/* global localStorage */
var React = require('react');
var Link = require('react-router').Link;
var IndexLink = require("react-router").IndexLink;
import { withRouter } from 'react-router';
var Parse = require('parse');
var event = require('../events.js');

// The main application layout
// this.props.children will be set by React Router depending on the current route
var App = React.createClass({
  getInitialState: function () {
    return{
      menutoggle: '',
      loggedIn: !!Parse.User.current()
    };
  },
  componentDidMount: function () {
   this.setState({menutoggle:''});
   event.on('loggedIn', this.handleLoginEvent);
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
  handleLoginEvent: function(event) {
    this.setState({
      loggedIn: true
    });
  },
  userLogout: function(what, e) {
    var that = this;
    e.preventDefault();
    e.stopPropagation();
    if(what === 'logout'){
      Parse.User.logOut().then(
        function(user) {
          var currentUser = Parse.User.current(); // this will now be null
          console.log('SUCCESSFUL LOGOUT', currentUser);
          that.setState({loggedIn: false});
        },
        function(error) {
          // Show the error message somewhere and let the user try again.
          alert("Error: " + error.code + " " + error.message);
        }
      );
      this.setState({menutoggle:''});
      var repName = localStorage.getItem('repName');
      if (repName) {
        this.props.router.push('/rep/' + repName);
      }
      else {
        this.props.router.push('/');
      }
    }
  },
  render: function() {
    
    // Logout Link
    if (this.state.loggedIn) {
      var loginSignup = <li>
        <a onClick={this.userLogout.bind(this, 'logout')} href="/login">Logout</a>
      </li>;
      
    } else {
       loginSignup = <li>
        <a onClick={this.userLogout.bind(this, 'logout')} href="/">Logout</a>
      </li>;
    }
    
    // Representative Link
    var repLink;
    var feedLink;
    var repName = localStorage.getItem('repName');
    if (repName) {
      repLink = '/rep/'+repName;
      feedLink = '/rep/'+repName+'/feed';
    }
    else {
      repLink = '/';
      feedLink = '/';
    }
    return (
      <div>
        <header>
            <Link className="navbutton rep" activeClassName="active" onClick={this.onMenuItemClick} to={repLink}>Home</Link>
            <Link className="navbutton feed" activeClassName="active" onClick={this.onMenuItemClick} to={feedLink}>Feed</Link>
            <Link className="navbutton compare" activeClassName="active" onClick={this.onMenuItemClick} to ="/compare/votedonbymyrep">Compare</Link>
            <Link className="navbutton petitions" activeClassName="active" onClick={this.onMenuItemClick} to ="/petitions">Petitions</Link>
            <Link className="navbutton stats" activeClassName="active" onClick={this.onMenuItemClick} to ="/stats">Stats</Link>
        </header>
        <div className="site-wrap">
          <main>{this.props.children}</main>
        </div>
      </div>
    );
  }
});


module.exports = withRouter(App);


/*          <nav>
            <div className="hamburgerDiv">
              <a href="#" onClick={this.onClick} className="hamburger">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
              </a>
            </div>
            
              <ul className={"clearfix menu " + this.state.menutoggle} >
                {loginSignup}
                <li>
                  <Link activeClassName="active" onClick={this.onMenuItemClick} to="/about">About</Link>
                </li>
                <li>
                  <Link className="yourRepresentativeMenu" activeClassName="active" to={repLink} onClick={this.onMenuItemClick}>Your Representative</Link>
                </li>
                <li>
                  <Link className="whatWouldYouDoMenu" activeClassName="active" onClick={this.onMenuItemClick} to ="/bills/active">What would you do?</Link>
                </li>
                <li>
                  <Link className="whatTheyreDoingMenu" activeClassName="active" onClick={this.onMenuItemClick} to={feedLink}>What's my rep doing</Link>
                </li>
                <li>
                  <Link activeClassName="active" className="petitionsMenu" onClick={this.onMenuItemClick} to="/petitions">Petitions</Link>
                </li>
                <li>
                  <Link activeClassName="active" className="compareMenu" onClick={this.onMenuItemClick} to="/compare">Compare</Link>
                </li>
              </ul>
              
              
              
              
              
              
                          <div className="hamburgerDiv">
              <a href="#" onClick={this.onClick} className="hamburger">
                <div className="dot">...</div>
              </a>
            </div>
              <ul className={"clearfix menu " + this.state.menutoggle} >
                {loginSignup}
                <li>
                  <Link activeClassName="active" onClick={this.onMenuItemClick} to="/about">About</Link>
                </li>
              </ul>
              
          </nav>*/