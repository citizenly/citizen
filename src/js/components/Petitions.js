var React = require('react');
var Link = require('react-router').Link;

// data viz landing page
var Petitions = React.createClass({
  render: function() {
    return (
      <div className="main petitionsPage">
        <div>
          <h1>List of petitions</h1>
        </div>
      </div>
    );
  }
});

module.exports = Petitions;