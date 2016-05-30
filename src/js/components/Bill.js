var React = require('react');
//var Link = require('react-router').Link;
// required for ajax calls
var axios = require('axios');
var $ = require('jquery');
import { withRouter } from 'react-router';

var Parse = require('parse');
var Vote = Parse.Object.extend('Vote');

var Bill = React.createClass({
  getInitialState: function() {
    // set inital state as an empty object, to be populated with bill info on componentDidMount
    return {
      bill: {
        id: '',
        title: '',
        summary: '',
        status: '',
        recentVote: '',
        lastVote: '',
        houseDebate: "**Lots of text**",
        proposedBy: '',
        repsVote: '',
        date: ''
      },
      content: "",
      vote: 0,
      greenBtnToggle: "greenbutton",
      redBtnToggle: "redbutton"
    };
  },
  componentDidMount: function() {
    this.loadBillData();
    this.setState({content: this.state.bill.title});
    $(".billTabs li").removeClass("active");
    $("#tab-" + 1).addClass("active");
  },
  componentDidUpdate: function(prevProps) {
    if(prevProps.params.filter !== this.props.params.filter) {
      this.loadBillData();
    }
  },
  loadBillData: function() {
    var that = this;
    // set billId as url parameter
    var billId = this.props.params.billId;
    this.setState({loading: true});
    
    // post billId to server and this.setState({bill: response.data})
    axios.post('/billinfoget', {
      billId: billId
    })
    .then(function(response) {
      that.setState({bill: response.data, loading: false});
    })
    .catch(function(response) {
      console.log(response, 'response');
    });
    
    // use Parse to store and retrieve user's vote status on this bill
    Parse.Cloud.run('findMyVote', {billId: this.props.params.billId}).then(function(vote) {
      if (vote) {
        if (vote.get('vote') === 1) {
          that.setState({
            greenBtnToggle: "greenbutton-clicked",
            redBtnToggle: "redbutton",
            vote: 1
          });
        }
        else if (vote.get('vote') === -1) {
          that.setState({
            greenBtnToggle: "greenbutton",
            redBtnToggle: "redbutton-clicked",
            vote: -1
          });
        }
      }
    });
  },
  handleTabClick: function(data){
    if(data===1) {
      this.setState({content: this.state.bill.title});
    }
    else if(data===2) {
      this.setState({content: this.state.bill.summary});
    }
    else if(data===3) {
      this.setState({content: this.state.bill.text});
    }
    else if(data===4) {
      this.setState({content: this.state.bill.houseDebate});
    }
    
    $(".billTabs li").removeClass("active");
    $("#tab-" + data).addClass("active");
  },
  handleGBtnClick: function(e) {
    e.preventDefault();
    var vote = {billId: this.props.params.billId};
    
    if (this.state.greenBtnToggle === "greenbutton") {
      this.setState({greenBtnToggle:"greenbutton-clicked", redBtnToggle:"redbutton", vote: 1});
      vote.vote = 1;
      Parse.Cloud.run('handleVote',  vote);
    }
    else if (this.state.greenBtnToggle === "greenbutton-clicked") {
      this.setState({greenBtnToggle:"greenbutton", vote: 0});
      vote.vote = 0;
      Parse.Cloud.run('handleVote', vote);
    }
  },
  handleRBtnClick: function(e) {
    e.preventDefault();
    var vote = {billId: this.props.params.billId};
    if (this.state.redBtnToggle === "redbutton") {
      this.setState({redBtnToggle:"redbutton-clicked", greenBtnToggle: "greenbutton", vote: -1});
      vote.vote = -1;
      Parse.Cloud.run('handleVote', vote);
    }
    else if (this.state.redBtnToggle === "redbutton-clicked") {
      this.setState({redBtnToggle:"redbutton", vote: 0});
      vote.vote = 0;
      Parse.Cloud.run('handleVote', vote);
    }
  },
  render: function() {
    return (
      <div>
        <div>
          <div>
            <div className="billInfo">
              <div className="whatwouldyoudo">
                What would you do?
              </div>
                
              <div className="billandid">
                <h3>BILL  <span className="billnumber">{this.state.bill.id}</span></h3>
              </div>
                
              <div className="tagDescriptions">
                <p>Last parliamentary vote <span className={"dynamic" + this.state.bill.lastVote}>{this.state.bill.lastVote}</span></p>
                <p>Proposed by <span className="dynamic">{this.state.bill.proposedBy}</span></p>
                <p>My representative voted <span className={"dynamic" + this.state.bill.repsVote.substring(0, 2)}>{this.state.bill.repsVote}</span></p>
            </div>
          </div>
    
          <div className="billTabs">
            <ul>
              <li id="tab-1" onClick={this.handleTabClick.bind(this, 1)}>Title</li>
              <li id="tab-2" onClick={this.handleTabClick.bind(this, 2)}>Summary</li>
              <li id="tab-3" onClick={this.handleTabClick.bind(this, 3)}>Full text</li>
              <li id="tab-4" onClick={this.handleTabClick.bind(this, 4)}>House Debate</li>
            </ul>
    
          	<div className="box-wrap">
            	<div id="box">
            	  <p>{this.state.content}</p>
            	</div>
            </div>
          </div>
        
        </div>
          
        <div className="votingButtons">
          <div className="leftarrow">
            <img alt="left" src="../../images/arrowleft.png"></img>
          </div>
                      
          <div onClick={this.handleRBtnClick} className={this.state.redBtnToggle}></div>

          <div className= "share">
            <i className="fa fa-share-alt"></i>
          </div>

          <div onClick={this.handleGBtnClick} className={this.state.greenBtnToggle}></div>

          <div className="rightarrow">
            <img alt="right" src="../../images/arrowright.png"></img>
          </div>
              
        </div>
      </div>
  </div>
    );
  }
});

module.exports = withRouter(Bill);