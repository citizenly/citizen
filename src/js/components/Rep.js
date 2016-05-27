var React = require('react');
var Link = require('react-router').Link;
// required for ajax calls
var axios = require('axios');


var Rep = React.createClass({
  getInitialState: function() {
    // set inital state as an empty object, to be populated with rep info on componentDidMount
    return {
      rep: {
        name: "",
        constituency: "",
        province: "",
        party: "",
        img: "",
        electedYear: "",
        electedVote: ""
      },
    };
  },
  componentDidMount: function() {
    var that = this;
    // get rep info using nameFormatted in url
    var nameFormatted = this.props.params.repName;
    axios.post('/repinfoget', {
      repName: nameFormatted
    })
    // update this.state with the rep object
    .then(function(response) {
      var updateData = that.state.rep;
      updateData = response.data;
      that.setState({rep: updateData});
    })
    .catch(function(response) {
    });
  },
  render: function() {
    return (
      <div>
      <div className="rep-container">

        <div className="rep-info">
          <div className="rep-pic">
            <img src={this.state.rep.img} />
          </div>
      
          <div className="rep-text">
            <p>You are being represented by:</p>
            <h2>{this.state.rep.name}</h2>
            <p>{this.state.rep.party} MP for {this.state.rep.constituency} ({this.state.rep.province})</p>
            <p>Won in {this.state.rep.electedYear} with {this.state.rep.electedVote}% of the vote</p>
          </div>
          
      </div>
      
      <div className="rep-stats-container">
      
          <div className="agreement">
            <h2>In agreement with...</h2>
          </div>
          
          <div className="neighbours">
            <h2>neighbours</h2>
            <h1>34%</h1>
          </div>
          
          <div className="you">
            <h2>you</h2>
            <h1>?</h1>
          </div>
          
          <div className="intheirvoting">
            <h2>... in their voting.</h2>
          </div>
      
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
            <Link to="/bills/active" activeClassName="active">WHAT WOULD YOU DO?</Link>
          </div>
       </footer>
    </div>

    );
  }
});

module.exports = Rep;