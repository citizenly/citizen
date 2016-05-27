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
        <h2>{this.props.billId} {this.props.resultOfVote ? <span className="result">{this.props.resultOfVote}</span> : null}</h2>
        <h4>{this.props.billTitle}</h4>
      </div>
    );
  }
});


// Bill constructor
var Bills = React.createClass({
  getInitialState: function() {
    // set inital state to determine which list of bills is displayed - active by default
    // ** need to fix my logic because it's always reverting to /active!
    return {
      billList: [],
    };
  },
  componentDidMount: function() {
    this.loadData();
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
    axios.post('/postfilter', {
      filter: filter
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
        <Bill billTitle={bill.billTitle} billId={bill.billId} resultOfVote={bill.resultOfVote}/>
      </li>
    );
  },
  render: function() {
    console.log(this.state.billList, 'this.state.billList');
    return (
      <div>
      
          <div className="whatwouldyoudo">
            What would you do?
          </div>
          
          <div className="searchbox">
            <input ref="search" className="searchinput " type="text" name="search" maxLength="20" placeholder="Search for bill by word, eg health, crime..." />
          </div>
  
          <div className="billTags">
              <div><Link activeClassName="active" to="/bills/active">active</Link></div>
              <div><Link activeClassName="active" to="/bills/passed">passed</Link></div>
              <div><Link activeClassName="active" to="/bills/failed">failed</Link></div>
              <div><Link activeClassName="active" to="/bills/proposedbymyrep">rep proposed</Link></div>
              <div><Link activeClassName="active" to="/bills/votedonbymyrep">rep voted</Link></div>
              <div><Link activeClassName="active" to="/bills/all">all</Link></div>
          </div>
          
          <div className="billList">
            {this.state.loading ? <p>Please wait while we find all the Bills...</p> : null}
            <div>
              {this.state.billList !== [] ? this.state.billList.map(this.renderBills) : 'We will have more filters coming soon'}
            </div>
          </div>
          
     </div>
    );
  }
});

module.exports = withRouter(Bills);