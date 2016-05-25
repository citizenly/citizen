var React = require('react');
var Link = require('react-router').Link;
// required for ajax calls
var axios = require('axios');


var Rep = React.createClass({
  getInitialState: function() {
    // set inital state as an empty object, to be populated with rep info on componentDidMount
    return {
      rep: {
        name: '',
        constituency: '',
        province: '',
        party: '',
        img: '',
        electedYear: '',
        electedVote: ''
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
      console.log(response);
    });
  },
  render: function() {
    return (
      <div className="main repInfoPage">
      
        <div className="repInfo row">
        
          <div className="col s3">
            <img className= "responsive-img" src={this.state.rep.img} />
          </div>
              
          <div className="col s9 flow-text center">
            <h3>You are being represented by:</h3>
            <h1>{this.state.rep.name}</h1>
            <p>{this.state.rep.party} MP for {this.state.rep.constituency} ({this.state.rep.province})</p>
            <p>Won in {this.state.rep.electedYear} with {this.state.rep.electedVote}% of the vote</p>
          </div>
          
        </div>
      
        <div className="repStats row">
      
          <div className="col s10 offset-2 center">
            <p>In agreement with...</p>
          </div>
          
          <div className="col s3 offset-3 center">
            <p>you</p>
            <p>**?**</p>
          </div>
          
          <div className="col s3 offset-3 center">
            <p>your neighbours</p>
            <p>**34%**</p>
          </div>
          
          <div className="col s10 offset-2 center">
            <p>... in her voting.</p>
          </div>

        </div>
      
        <div className="bottomNav">
          <div className="bottomMenu row">
            <div className="col s3 center">
              <div className="bottomMenu-item compare card-panel hoverable">
                <Link to="/compare" activeClassName="active">COMPARE</Link>
              </div>
            </div>
            <div className="col s3 center">
              <div className="bottomMenu-item petitions card-panel hoverable">
                <Link to="/petitions" activeClassName="active">PETITIONS</Link>
              </div>
            </div>
            <div className="col s3 center">
              <div className="bottomMenu-item feed card-panel hoverable">
                <Link to="/feed" activeClassName="active">WHAT THEY'RE DOING</Link>
              </div>
            </div>
            <div className="col s3 center">
              <div className="bottomMenu-item bills card-panel hoverable">
                <Link to="/bills" activeClassName="active">WHAT WOULD YOU DO?</Link>
              </div>
            </div>
          </div>
         </div>
      </div>
    );
  }
});

module.exports = Rep;