var React = require('react');
var Link = require('react-router').Link;

// home "page"
var Home = React.createClass({
  render: function() {
    return (
      <div className="main">
          <h1 className="pageTitle">Welcome to CITIZEN</h1>
          <Link to="/order">Order</Link>
      </div>
    );
  }
});

module.exports = Home;