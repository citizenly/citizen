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
      var updateData = that.state.billList;
      updateData = response.data;
      that.setState({billList: updateData});
      console.log(that.state.billList, 'that.state.billList');
      loading: false;
    })
    .catch(function(response) {
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
        
        {this.state.billList.map(function(bill){
          return (
            <h1>bill list: {this.state.billList.billId}</h1>
          );
        })}
      </div>
    );
  }
});

module.exports = withRouter(Bills);


      //{
      //   id: "**C-14**",
      //   title: "**An Act to amend the Criminal Code and to make related amendments to other Acts (medical assistance in dying)**",
      //   status: "**Bill Not Active**",
      //   lastVote: "**Passed**",
      //   proposedBy: "**Jody Wilson-Raybould**",
      //   repsVote: "**Didn't vote**",
      //   date: "**2016-05-12**"
      // }, {
      //   id: "**C-10**",
      //   title: "**An Act to amend the Air Canada Public Participation Act and to provide for certain other measures**",
      //   status: "**Active**",
      //   lastVote: "**Failed*",
      //   proposedBy: "**Marc Garneau **",
      //   repsVote: "**Yes**",
      //   date: "**2016-05-11**"
      // }, {
      //   id: "**C-6**",
      //   title: "**An Act to amend the Citizenship Act and to make consequential amendments to another Act**",
      //   status: "**Active**",
      //   lastVote: "**Passed**",
      //   proposedBy: "**John McCallum**",
      //   repsVote: "**No**",
      //   date: "**2016-05-02**"
      // }