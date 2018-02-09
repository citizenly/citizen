/*global localStorage */

var React = require('react');
var Link = require('react-router').Link;
// required for ajax calls
var axios = require('axios');
import { withRouter } from 'react-router';

// Bill constructor
//Only show the result of last vote and how my MP voted about that when the //filter is "votedonbymyrep"
var Bill = React.createClass({

  render: function() {
      var result = this.props.resultOfVote || "";
      var resultClass = "result"+result || "";
      var ballot = this.props.ballot || "";
      var ballotClass = "dynamic" + (ballot.substring(0, 2)); 
      
    return (
      <div className="listedItem">
        <Link to={"/singlebill/" + this.props.billId}>
          <div className="sub-h2">{this.props.billId}</div>
          <div className="one-line-spread">
            <h4>Latest status in parliament: </h4>
            { ( this.props.params.filter === "votedonbymyrep" &&  this.props.ballot) ? <h4 className={resultClass}>{result}</h4> : <h4 class="dynamicDi">No action yet</h4> }
          </div>
          <div className="one-line-spread">
          <h4>My representative voted: </h4>
          { (this.props.params.filter === "votedonbymyrep" &&  this.props.ballot) ?  <h4 className={ballotClass}>{ballot}</h4> : <h4 class="dynamicDi">No action yet</h4> } 
          </div>
          <h5>{this.props.billTitle}</h5>
        </Link>
      </div>
    );
  }
});


// Bills constructor
var Compare = React.createClass({
  getInitialState: function() {
    // set inital state to determine which list of bills is displayed - 'rep voted' by default
    return {
      billList: [],
      repFullName: ""
    };
  },
  componentDidMount: function() {
    this.loadData();
  },
  componentWillMount: function(){
    this.setState({
      repFullName: localStorage.getItem('repFullName')
    });
  },
  componentDidUpdate: function(prevProps) {
    if(prevProps.params.filter !== this.props.params.filter) {
      this.loadData();
    }
  },
  loadData: function() {
    var that = this;
    // set filter as url parameter
    var filter = this.props.params.filter;
    this.setState({loading: true});

    // post filter to server and this.setState({billList: response.data})
    var repName = localStorage.getItem("repName");
    axios.post('/postfilter', {
      filter: filter,
      repName: repName
    })
    .then(function(response) {
      that.setState({billList: response.data, loading: false});
    })
    .catch(function(response) {
      console.log(response, 'response');
    });
  },
  renderBills: function(bill) {
    return (
      <li key={bill.billId}>
        <Bill billTitle={bill.billTitle} billId={bill.billId} resultOfVote={bill.resultOfVote} params={{filter: this.props.params.filter}} ballot={bill.ballot}/>
      </li>
    );
  },
  render: function() {
    return (
      <div className="comparePage">
          <div className="centered-container">
              <div className="top-h2">bills</div>
              {this.props.params.filter === "votedonbymyrep"  ? <p>The below shows the bills {this.state.repFullName} has voted on.</p>  : ""} 
              {this.props.params.filter === "proposedbymyrep"  ? <p>The below shows bills your representative {this.state.repFullName} has proposed.</p>  : ""} 
          </div>
        <div className="filters">
          <div><Link activeClassName="active" to="/compare/votedonbymyrep">New votes</Link></div>
          <div><Link activeClassName="active" to="/compare/proposedbymyrep">Proposed</Link></div>
          <div><Link activeClassName="active" to="/compare/active">Active</Link></div>
          <div><Link activeClassName="active" to="/compare/all">All</Link></div>
        </div>
        <div className="list">
          {this.state.loading ? <p>Please wait while we find all the Bills...</p> : null}
          <div>
            {this.state.billList.length === 0 ? <p>More filters coming soon</p> : this.state.billList.map(this.renderBills)}
          </div>
        </div>
     </div>
    );
  }
});

module.exports = withRouter(Compare);