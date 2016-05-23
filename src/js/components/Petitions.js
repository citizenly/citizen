var React = require('react');
var Link = require('react-router').Link;

// data viz landing page
var Petitions = React.createClass({
  render: function() {
    return (
      <div className="main peititionsPage">
        <div>
          <h1>Petitions Landing Page</h1>
        </div>
      </div>
    );
  }
});

module.exports = Petitions;