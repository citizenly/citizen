var React = require('react');
var Link = require('react-router').Link;

// not found "page"
var NotFound = React.createClass({
  render: function() {
    return (
      <div className="main notFoundPage">Not Found!</div>
    );
  }
});

module.exports = NotFound;