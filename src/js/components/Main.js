var React = require('react');
var Link = require('react-router').Link;
var IndexLink = require("react-router").IndexLink;
import { withRouter } from 'react-router';
var Parse = require('parse');
/* global localStorage */

var repName = '';
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
  
  onRepClick: function(e) {
  // Get repName from localStorage if possible, to be used in the url of the rep, otherwise redirect to the homepage
    e.preventDefault();
    repName = localStorage.getItem('repName');
    console.log(repName, 'repName');
    if (repName) {
      this.props.router.push('/rep/' + repName);
    }
    else {
      this.props.router.push('/');
    }
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
  
  userLogout: function(what, e) {
    e.preventDefault();
    e.stopPropagation();
    if(what === 'logout'){
      Parse.User.logOut().then(
        function(user) {
          var currentUser = Parse.User.current(); // this will now be null
          console.log('SUCCESSFUL LOGOUT', currentUser);
        },
        function(error) {
          // Show the error message somewhere and let the user try again.
          alert("Error: " + error.code + " " + error.message);
        }
      );
    }
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
                  <Link activeClassName="active" onClick={this.onMenuItemClick} to="/signup">Signup</Link>
                </li>
                <li>
                  <a onClick={this.userLogout.bind(this, 'logout')}>Logout</a>
                </li>
                <li>
                  <Link activeClassName="active" onClick={this.onMenuItemClick} to="/about">About</Link>
                </li>
                <li>
                  <Link activeClassName="active" to="/rep/" onClick={this.onRepClick + this.onMenuItemClick}>Your Representative</Link>
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


/////BACKARROW, IF WE WANT IT IN THE FUTURE/////
          /*
          <div className="backArrow">
            <div className="backityArrow"></div>
          </div>*/