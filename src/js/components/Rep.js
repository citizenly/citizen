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
          <nav className="bottomMenu">
            <ul>
              <li>
                <Link to="/compare" activeClassName="active">Compare</Link>
              </li>
              <li>
                <Link to="/petitions" activeClassName="active">Petitions</Link>
              </li>
              <li>
                <Link to="/feed" activeClassName="active">What they're doing</Link>
              </li>
              <li>
                <Link to="/bills" activeClassName="active">What would you do?</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }
});

module.exports = Rep;