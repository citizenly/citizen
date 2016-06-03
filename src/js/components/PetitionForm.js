var React = require('react');
var Link = require('react-router').Link;
var IndexLink = require("react-router").IndexLink;
import { withRouter } from 'react-router';
var Parse = require('parse');

var PetitionForm = React.createClass({
  render: function() {
    return (
        <div className="formPage">
          <div className="petitionHeading">Petition</div>
          <h1 className="formTitle">Start new</h1>
          <p>Once at least 100 people have agreed with your petition and the deadline is up it will be automatically sent to your MP.  </p>
          <form className="formEntryFields" method="post">
            <input type="text" name="name" placeholder="topic"/>
            <input type="text" name="summary" placeholder="summary"/>
            <input type="text" name="dateStart" placeholder="date start" />
            <input type="text" name="dateEnd" placeholder="date end"/>
            <p>In order to create a valid petition you need to be <Link to="/login">logged in</Link>. By clicking 'start petition' you agree that you name, address, email and phonenumber will be added to the petition.</p>
            <button onClick={this.continueOrder} type="button" className="formButton">Start petition</button>
          </form>
        </div>
    );
  }
});

module.exports = PetitionForm;