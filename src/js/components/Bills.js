var React = require('react');
//var Link = require('react-router').Link;
// required for ajax calls
var axios = require('axios');
import { withRouter } from 'react-router';


var Bills = React.createClass({
  getInitialState: function() {
    // set inital state to determine which list of bills is displayed - active by default
    return {
      filter: "active",
      billList: []
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
      filter: filter
    })
    .then(function(response) {
      that.setState({billList: response.data});
      console.log(that.state.billList, 'that.state.billList');
    })
    .catch(function(response) {
      console.log(response, 'response');
    });
  },
  // handleOnClick: function(e) {
  //   e.preventDefault();
  //   var that = this;
  //   var filter = "";
  //   axios.post('/postfilter', {
  //     filter: ""
  //   }).then(function(response) {
  //     var path = '/bills/' + response.data;
  //     that.props.router.push(path);
  //   })
  //   .catch(function(response) {
  //     console.log(response, 'response');
  //   });
  // },
  render: function() {
    console.log(this.state.billList, 'that.state.billList');
    return (
      <div>
        <div className="billInfo">
          <h3>What would you do?</h3>
          <h1>Bills</h1>
          
          <div className="searchbox">
          </div>
          
          <div className="billTags">
            <ul>
              <li><button onClick={this.handleOnClick}></button>active</li>
              <li>passed</li>
              <li>failed</li>
              <li>rep proposed</li>
              <li>rep voted</li>
              <li>all</li>
            </ul>
          </div>
          <h2>bill.id</h2>
          <h2>My representative voted: repsVote</h2>
        </div>
        
        {this.state.billList.map(function(bill, i){
          return (
            <h1 key={bill.billId + i}>bill list: {bill.billId}</h1>
          );
        })}
      </div>
    );
  }
});

module.exports = withRouter(Bills);