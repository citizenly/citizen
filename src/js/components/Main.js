var React = require('react');
var Link = require('react-router').Link;
var IndexLink = require("react-router").IndexLink;
import { withRouter } from 'react-router';

// The main application layout
// this.props.children will be set by React Router depending on the current route

var App = React.createClass({
  
getInitialState: function () {
  return{
  menutoggle: ""
  };
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


  
  render: function() {
    return (
        <div>
          <header>
              <nav>
                    <a href="#" onClick={this.onClick} className="hamburger">
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                  </a>
                  <ul className={"main__ul clearfix menu " + this.state.menutoggle} >
                    <li className={"main__li"}>
                      <IndexLink activeClassName="active" to="/">Home</IndexLink>
                    </li>
                    <li className={"main__li"}>
                      <Link activeClassName="active" to="/login">Login</Link>
                    </li>
                    <li className={"main__li"}>
                      <Link activeClassName="active" to="/rep">Your Representative</Link>
                    </li>
                    <li className={"main__li"}>
                      <Link activeClassName="active" to="/bills">What would you do?</Link>
                    </li>
                    <li className={"main__li"}>
                      <Link activeClassName="active" to="/feed">What they're doing</Link>
                    </li>
                    <li className={"main__li"}>
                      <Link activeClassName="active" to="/petitions">Petitions</Link>
                    </li>
                    <li className={"main__li"}>
                      <Link activeClassName="active" to="/compare">Compare</Link>
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
