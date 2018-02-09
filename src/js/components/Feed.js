var React = require('react');
var Link = require('react-router').Link;
// required for ajax calls
var axios = require('axios');
import { withRouter } from 'react-router';

var Declaration = React.createClass({
  render: function() {
      var type = this.props.type || "";
      var ballot = this.props.ballot || "";
      var billId= this.props.billId || "";
      var billTitle= this.props.billTitle || "";
      var where= this.props.where || "";
      var on= this.props.on || "";
      var content = this.props.content || "";
      var contentUrl = this.props.contentUrl || "";
    
    if(type === "speech") {
      var dec = <div>
      <p className="noBottomPadding">Spoke {where} on <i>{on}</i></p>
      <p>"{content}..." <a href={contentUrl}>read more</a></p>
      </div>;
    } 
    else{
      dec = <div>
      <p className="noBottomPadding">Voted <span className={"dynamic" + ballot.substring(0, 2) }>{ballot}</span> on bill <Link to={"/bill/"+ billId}>{billId}</Link></p><p><Link to={"/bill/"+ billId}>{billTitle}</Link></p>
      </div>;
    }
    return (
      <div>
        {dec}
      </div>
    );
  }
});


var i = 0;

var Feed = React.createClass({
  getInitialState: function() {
    // set inital state to determine which list of feed is displayed - all by default
    
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
      feedList: {"yesterday":[], "twoDaysAgo":[], "thisWeek":[], "lastWeek": [] },
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
    if(prevProps.params.repName !== this.props.params.repName) {
      this.loadData();
    }
  },
  loadData: function() {
    var that = this;
    this.setState({loading: true});
    
    
  // post repName to server and this.setState({feedList: response.data})
    axios.post('/feedinfoget', {
      repName: this.props.params.repName
      
    })
    .then(function(response) {
      that.setState({feedList: response.data, loading: false});
    })
    .catch(function(response) {
      console.log(response, 'response');
    });
  },  

  renderDeclaration: function(dec) {
    i++;
      return (
        <li key={i}>
          <Declaration type={dec.type} ballot={dec.ballot} billId={dec.billId} billTitle={dec.billTitle} where={dec.where} on={dec.on} content={dec.content} contentUrl={dec.contentUrl}/>
        </li>
        
      );
    },
    
  render: function() {
    return (
      <div>
          <div className="centered-container">
            <div className="top-h2">statements</div>
            <div className="sub-h2">by {this.state.repFullName}</div>
          </div>
          
          <div className="feedList">
            <div>
              <h2>Yesterday</h2>
              {this.state.feedList.yesterday[0] ? this.state.feedList.yesterday.map(this.renderDeclaration) : <p>Your representative had nothing to say</p>}
              <h2>Two days ago</h2>
              {this.state.feedList.twoDaysAgo[0] ? this.state.feedList.twoDaysAgo.map(this.renderDeclaration) : <p>Your representative had nothing to say</p>}
              <h2>This week</h2>
              {this.state.feedList.thisWeek[0] ? this.state.feedList.thisWeek.map(this.renderDeclaration) : <p>Your representative had nothing to say</p>}
              <h2>Last week</h2>
              {this.state.feedList.lastWeek[0] ? this.state.feedList.lastWeek.map(this.renderDeclaration) : <p>Your representative had nothing to say</p>}
              
            </div>
          </div>
          
     </div>
    );
  }
});

module.exports = Feed;