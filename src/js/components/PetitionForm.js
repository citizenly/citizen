var React = require('react');
// link to data module that's storing the inputted info

var PetitionForm = React.createClass({
  render: function() {
    return (
        <div className="formPage">
          <div className="petitionHeading">Petition</div>
          <h1 className="formTitle">Start new</h1>
          <p>Once at least 100 people have agreed with your petition and the deadline is up it will be automatically sent to your MP.  </p>
          <form className="formEntryFields" method="post">
            <input type="text" name="name" placeholder="name"/>
            <input type="text" name="email" placeholder="email address"/>
            <input type="text" name="phone" placeholder="phone number" />
            <input type="text" name="street" placeholder="street address"/>
            <input type="text" name="city" placeholder="city"/>
            <input type="text" name="province" placeholder="province"/>
            <input type="text" name="postalcode" placeholder="postal code"/>
            <button onClick={this.continueOrder} type="button" className="formButton">Start petition</button>
          </form>
        </div>
    );
  }
});

module.exports = PetitionForm;