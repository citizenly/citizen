var React = require('react');
var Link = require('react-router').Link;
//var EventEmitter = require('../events');
var data = require("../data.js");


var Rep = React.createClass({
  getInitialState: function() {
    // get initial state with rep's info based on postal code
    var rep = data.getData('rep') || {};
    return {
      rep: {
        name: rep.name || '**Codrin Diaconu**',
        constituency: rep.constituency || '**Downtown**',
        province: rep.province || '**QC**',
        party: rep.party || '**Communist**',
        img: rep.img || '../images/567_1.jpg',
        electedYear: rep.electedYear || '**2016**',
        electedVote: rep.electedVote || '**92%**',
      },
    };
  },
  render: function() {
    return (
      
      <div className="rep-container">
      
          <div className="rep-info">
                <div className="rep-pic">
                    <img src={this.state.rep.img} />
                </div>
                    
                <div className="rep-text">
                    <h3>You are being represented by:</h3>
                    <h1>{this.state.rep.name}</h1>
                    <p>{this.state.rep.party} MP for {this.state.rep.constituency} ({this.state.rep.province})</p>
                    <p>Won in {this.state.rep.electedYear} with {this.state.rep.electedVotes} of the vote</p>
                </div>
          </div>
      
      <div className="rep-stats-container">
      
          <div>
                <p>In agreement with...</p>
          </div>
          
          <div>
                <p>you</p>
                <p>**?**</p>
          </div>
          
          <div>
                <p>your neighbours</p>
                <p>**34%**</p>
          </div>
          
          <div>
                <p>... in her voting.</p>
          </div>

      </div>
      
      <footer>
        <div className="bottomMenu-item compare">
          <Link to="/compare" activeClassName="active">COMPARE</Link>
        </div>
        <div className="bottomMenu-item petitions">
          <Link to="/petitions" activeClassName="active">PETITIONS</Link>
        </div>
        <div className="bottomMenu-item feed">
          <Link to="/feed" activeClassName="active">WHAT THEY'RE DOING</Link>
        </div>
        <div className="bottomMenu-item bills">
          <Link to="/bills" activeClassName="active">WHAT WOULD YOU DO?</Link>
        </div>
     </footer>
  </div>
    );
  }
});

module.exports = Rep;