var React = require('react');
var Link = require('react-router').Link;

// bills landing page
var Bills = React.createClass({
  render: function() {
    return (
      <div className="main billsPage">
        <div>
          <h1>Bills Landing Page</h1>
        </div>
      </div>
    );
  }
});

module.exports = Bills;