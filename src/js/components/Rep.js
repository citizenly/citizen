var React = require('react');
var Link = require('react-router').Link;

var Rep = React.createClass({
  getInitialState: function() {
    // get initial state with rep's info based on postcode
    // retrieve from openparliament.ca API - https://api.openparliament.ca/
    var rep = rep || {};
    return {
      rep: {
        name: rep.name || '**Codrin Diaconu**',
        constituency: rep.constituency || '**Downtown**',
        province: rep.province || '**QC**',
        party: rep.party || '**Liberal**',
        img: rep.img || '../images/567_1.jpg',
        electedYear: rep.electedYear || '**2016**',
        electedVotes: rep.electedVotes || '**92%**',
      },
     };
  },
  render: function() {
    return (
      <div className="main repInfoPage">
        <div className="repInfo">
          <img src={this.state.rep.img} />
          <h3>You are being represented by:</h3>
          <h1>{this.state.rep.name}</h1>
          <p>{this.state.rep.party} MP for {this.state.rep.constituency} ({this.state.rep.province})</p>
          <p>Won in {this.state.rep.electedYear} with {this.state.rep.electedVotes} of the vote</p>
        </div>
        <div className="repStats">
          <p>In agreement with...</p>
          <div>
            <p>you</p>
            <p>**?**</p>
          </div>
          <div>
            <p>your neighbours</p>
            <p>**34%**</p>
          </div>
          <p>... in her voting.</p>
        </div>
        <div className="bottomNav">
          <nav className="bottomMenu row">
            <div className="compare col s3 center card-panel hoverable">
              <Link to="/compare" activeClassName="active">COMPARE</Link>
            </div>
             <div className="petitions col s3 center card-panel hoverable">
              <Link to="/petitions" activeClassName="active">PETITIONS</Link>
            </div>
             <div className="feed col s3 center card-panel hoverable">
              <Link to="/feed" activeClassName="active">WHAT THEY'RE DOING</Link>
            </div>
             <div className="bills col s3 center card-panel hoverable">
              <Link to="/bills" activeClassName="active">WHAT WOULD YOU DO?</Link>
            </div>
          </nav>
         </div>
      </div>
    );
  }
});

module.exports = Rep;