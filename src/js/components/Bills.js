var React = require('react');
var Link = require('react-router').Link;
// required for ajax calls
var axios = require('axios');
import { withRouter } from 'react-router';

// Bill constructor
var Bill = React.createClass({
  render: function() {
    return (
      <div>
        <h2>{this.props.billId}</h2>
        <h4>{this.props.date}</h4>
      </div>
    );
  }
});


// Bill constructor
var Bills = React.createClass({
  getInitialState: function() {
    // set inital state to determine which list of bills is displayed - active by default
    return {
      filter: "active",
      billList: [],
    };
  },
  componentDidMount: function() {
    var that = this;
    // set filter as url parameter
    var filter = this.state.filter;
    var path = '/bills/' + filter;
    this.props.router.push(path);
    
    // post filter to server and this.setState({billList: response.data})
    axios.post('/postfilter', {
      filter: filter,
      loading: true
    })
    .then(function(response) {
      that.setState({billList: response.data});
    })
    .catch(function(response) {
      console.log(response, 'response');
    });
  },
  renderBills: function(bill) {
    return (
      <li key={bill.billId}>
        <Bill date={bill.date} billId={bill.billId}/>
      </li>
    );
  },
  render: function() {
    return (
      <div>
        <div className="billInfo">
          <h3>What would you do?</h3>
          <h1>Bills</h1>
          
          <div className="searchbox">
          </div>
          
          <div className="billTags">
            <ul>
              <li><Link activeClassName="active" to="/bills/active">active</Link></li>
              <li><Link activeClassName="active" to="/bills/passed">passed</Link></li>
              <li><Link activeClassName="active" to="/bills/failed">failed</Link></li>
              <li><Link activeClassName="active" to="/bills/proposedbymyrep">rep proposed</Link></li>
              <li><Link activeClassName="active" to="/bills/votedonbymyrep">rep voted</Link></li>
              <li><Link activeClassName="active" to="/bills/all">all</Link></li>
            </ul>
          </div>
          <h2>bill.id</h2>
          <h2>My representative voted: repsVote</h2>
        </div>
        
        <div>
          {this.state.loading ? <p>Please wait while we find all the Bills...</p> : null}
          <ul>
            {this.state.billList.map(this.renderBills)}
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = withRouter(Bills);