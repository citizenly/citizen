var React = require('react');
var Link = require('react-router').Link;


// home "page"
var Home = React.createClass({
  render: function() {
    // user enters postalcode and rep's name is retrieved from Represent API - https://represent.opennorth.ca/api/
    return (
      <div className="main">
        <h1 className="pageTitle">CITIZEN</h1>
        <p>In a democracy, you elect someone to make decisions for you. Check out what they're doing in your name.</p>
        <h1>Who's Representing Me?</h1>
          
        <form method="post">
        <input type="text" name="postalcode" placeholder="enter your postal code" value="" onChange=""/>
        <button onClick="" type="button" disabled="">Find Out</button>
        </form>
      </div>
    );
  }
});

module.exports = Home;