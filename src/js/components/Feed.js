var React = require('react');
var Link = require('react-router').Link;
// required for ajax calls
var axios = require('axios');
import { withRouter } from 'react-router';


var Feed = React.createClass({
  getInitialState: function() {
    // set inital state to determine which list of feed is displayed - all by default
    
    return {
      feedList: [],
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
    if(prevProps.params.source !== this.props.params.source) {
      this.loadData();
    }
  },
  loadData: function() {
    var that = this;
    // set source as url parameter
    var source = this.props.params.source;
    this.setState({loading: true});
  
  // post source to server and this.setState({feedList: response.data})
    var repName = localStorage.getItem("repName");
    axios.post('/feedinfoget', {
      source: source,
      repName: repName
    })
    .then(function(response) {
      that.setState({feedList: response.data, loading: false});
      console.log(response.data, "RESPONSE_DATA")
    })
    .catch(function(response) {
      console.log(response, 'response');
    });
  },  

  render: function() {
    return (
      <div>
      
          <div className="whatTheyreDoingHeading">
            What They're Doing
          </div>
          
          <h3>FEED</h3>
 
          <div className="searchbox">
            <input ref="search" className="searchinput " type="text" name="search" maxLength="20" placeholder="Search what your representative is doing" />
          </div>
  
          <div className="billTags">
              <div>All</div>
              <div>Votes</div>
              <div>Social</div>
              <div>Speeches</div>
          </div>
          
          <div className="feedList">
            <div>
              <h2>Yesterday</h2>
                <p></p>
              <h2>Two days ago</h2>
              <h2>This week</h2>
              <h2>Last week</h2>
              
            </div>
          </div>
          
     </div>
    );
  }
});

module.exports = Feed;