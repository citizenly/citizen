var React = require('react');

var Rep = React.createClass({
  getInitialState: function() {
    // get initial state with rep's info based on postcode
    // retrieve from openparliament.ca API
    var rep = rep || {};
    return {
      rep: {
        name: rep.name || '**Justin Trudeau**',
        constituency: rep.constituency || '**Papineau**',
        province: rep.province || '**QC**',
        party: rep.party || '**Liberal**',
        img: rep.img || '**img.jpg**',
        electedYear: rep.electedYear || '**2015**',
        electedVotes: rep.electedVotes || '**52%**',
      },
     };
  },
  render: function() {
    return (
      <div className="main repInfoPage">
        <h3>You are being represented by:</h3>
        <h1>{this.state.rep.name}</h1>
        <p>{this.state.rep.party} MP for {this.state.rep.constituency} ({this.state.rep.province})</p>
        <p>Won in {this.state.rep.electedYear} with {this.state.rep.electedVotes} of the vote</p>
      </div>
    );
  }
});

module.exports = Rep;