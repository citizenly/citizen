var React = require('react');
var Link = require('react-router').Link;
var IndexLink = require("react-router").IndexLink;
var Message = require('./Message');

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



/*
      $('.hamburger').on('click', function(e) {
  // Prevent link from jumping to the top of the page
  e.preventDefault();
  // If menu is already showing, slide it up. Otherwise, slide it down.
  $('.menu').toggleClass('slide-down');*/
  
  
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
                  <ul className={"clearfix menu " + this.state.menutoggle} >
                    <li>
                      <IndexLink activeClassName="active" to="/">**HOME - just for us now**</IndexLink>
                    </li>
                    <li>
                      <Link activeClassName="active" to="/login">LOGIN</Link>
                    </li>
                    <li>
                      <Link activeClassName="active" to="/rep">YOUR REPRESENTATIVE</Link>
                    </li>
                    <li>
                      <Link activeClassName="active" to="/bills">WHAT WOULD YOU DO?</Link>
                    </li>
                    <li>
                      <Link activeClassName="active" to="/feed">WHAT THEY'RE DOING</Link>
                    </li>
                    <li>
                      <Link activeClassName="active" to="/petitions">PETITIONS</Link>
                    </li>
                    <li>
                      <Link activeClassName="active" to="/compare">COMPARE</Link>
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

module.exports = App;


