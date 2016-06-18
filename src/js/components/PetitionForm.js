var React = require('react');
var Link = require('react-router').Link;
// required for ajax calls
//var axios = require('axios');
var formattedPc = require("../helperFunctions/validatePc.js");
import { withRouter } from 'react-router';
var event = require('../events');
var Message = require('./InvalidPcMessage');
//var event = require('../events');
var Parse = require('parse');

var PetitionForm = React.createClass({
  getInitialState: function() {
    return {
      invalidPostalCode: ""
    };
  },
  handleSignup: function(e) {
    e.preventDefault();
    var that = this;
    var username = this.refs.username.value;
    var password = this.refs.password.value;
    
    // check postal code is valid
    var pc = this.refs.postalcode.value;
    var userPostalCode = formattedPc.validatePC(pc);
    
    // show error msg if invalid postal code is entered
    if(userPostalCode === "invalid") {
      this.setState({invalidPostalCode: "alert"});
      event.emit('show_message', {message:"Enter a valid postal code"});
    }
    else {
      // signup new user using Parse
      var user = new Parse.User();
      user.set("username", username);
      user.set("password", password);
      user.set("postalcode", userPostalCode);

      user.signUp(null,{
        success:function(user){
          console.log('SUCCESSFUL SIGNUP', user);
          event.emit('loggedIn');
          
          var repName = localStorage.getItem('repName');
          if (repName) {
            that.props.router.push('/rep/' + repName);
          }
          else {
            that.props.router.push('/');
          }
        },
        error:function(user,error){
          // Show the error message somewhere and let the user try again.
          alert("Error: " + error.code + " " + error.message);
        }
      });
    }
  },
  render: function() {
    return (
        <div className="formPage">
          <h3 className="formTitle">Start new</h3>
          <p>Once at least 100 people have agreed with your petition and the deadline is up it will be automatically sent to your MP.  </p>
          <form className="formEntryFields" method="post">
            <input type="text" name="name" placeholder="topic"/>
            <input type="text" name="summary" placeholder="summary"/>
            <input type="text" name="dateStart" placeholder="date start" />
            <input type="text" name="dateEnd" placeholder="date end"/>
          </form>
            <p>In order to create a petition you'll need to add the below information, as per the requirements for valid petitions defined by the Government of Canada.</p>
          <form className="formEntryFields" method="post" onSubmit={this.handleSignup}>
            <input ref="firstname" className="firstname" type="text" name="firstname" maxLength="50" placeholder="first name" />
            <input ref="lastname" className="lastname" type="text" name="lastname" maxLength="50" placeholder="last name" />
            <input ref="password" className="password" type="password" name="password" maxLength="50" placeholder="password*" />
            <input ref="postalcode" className={"postcodeinput " + this.state.invalidPostalCode } type="text" name="postalcode" maxLength="7" placeholder="postal code*" />
            <input ref="phone" className="phone" type="text" name="phone" maxLength="25" placeholder="phonenumber" />
            <div className= "disclaimerText">Please note that if you create a petition in 'Citizen' your name, city, country, postal code, and telephone number will be automatically added to that specific petition. By clicking 'start petition' below you're saying you agree to this.</div>
            <Message/>
          </form>
            <button onClick={this.continueOrder} type="button" className="formButton">Start petition</button>
        </div>
    );
  }
});

module.exports = PetitionForm;







//////TEXT TO BE ADDED TO INFO BUTTONS///////////

/*

ADDRESSEE

The petition must be addressed to one of the following:

“the House of Commons” or “the House of Commons in Parliament assembled”;
“the Government of Canada”;
a Minister of the Crown; or
a Member of the House of Commons.
Text

When creating a new petition, you will need to compose a text of no more than 250 words that identifies whom it is that you are addressing, and the specific request you are making of them, also called a “prayer,” to take or to avoid some concrete action in order to remedy a grievance.

The petition may also include a more detailed description of the grievance or a statement of opinion, but these alone cannot be received as a petition; a concrete, specific request must be included. The request must be clear and to the point, and phrased as a request and not as a demand.

The text of your e-petition may not include a URL, any other link or web-based reference. Any petition that includes such links will be rejected.



LANGUAGE

The petition must be respectful, use temperate language, and not contain improper or unparliamentary language. In particular, it should not contain disrespectful or offensive language with respect to the Crown, Parliament, or the courts. It may not include charges made against the character or conduct of Parliament, the courts, or any other duly-constituted authority. The e-petition must be written in either English or French.



SUBJECT OF THE PETITION

Federal jurisdiction
The petition must concern a subject that is within the authority of the Parliament of Canada, the House of Commons, or the Government of Canada. A petition must not concern a purely provincial or municipal matter.

Sub judice
The petition may not concern a matter that is sub judice, i.e. a matter that is the subject of legal proceedings or currently before the courts.

Similar petitions
Two e-petitions that are substantially the same may not be open for signature at the same time. An e-petitioner whose e-petition is substantially the same as another may wait for the first e-petition to close, or may amend his or her e-petition so as to make it distinctive. A search function is available on the website in order to identify exisiting e-petitions.*/