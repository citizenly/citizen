/*global localStorage*/
var React = require('react');

// required for ajax calls
var axios = require('axios');
var $ = require('jquery');
import { withRouter } from 'react-router';

var Parse = require('parse');
var Vote = Parse.Object.extend('Vote');


var SingleBill = React.createClass({
  getInitialState: function() {
    // set inital state as an empty object, to be populated with bill info on componentDidMount
    return {
      bill: {
        id: '' ,
        title: '',
        summary: '',
        text: '',
        status: '',
        recentVote: '' ,
        lastVote: '',
        proposedBy: '',
        partyOfSponsor: '',
        repsVote: '' ,
        date: '',
        textUrl: ''
      },
      content: "",
      vote: 0,
      greenBtnToggle: "greenbutton",
      redBtnToggle: "redbutton",
      shareButtonToggle: false,
      facebookButton: "",
      twitterButton: "",
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
    // msg whilst data loads
    this.setState({loading: true});
    
    // post billId and repName to server and this.setState({bill: response.data})
    var repName = localStorage.getItem("repName");
    axios.post('/billinfoget', {
      billId: billId,
      repName: repName
    })
    .then(function(response) {
      that.setState({bill: response.data, loading: false});
    })
    .then(function() {
      that.setState({content: that.state.bill.title});
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
  handleShareButtonClick: function(e) {
    e.preventDefault();
    
    this.setState({
      shareButtonToggle: !this.state.shareButtonToggle
    });
  },
  render: function() {
    console.log(this.state.bill, 'this.state.bill');

    if (this.state.bill.repsVote) {
      var repVoted = <span className={"dynamic" + this.state.bill.repsVote.substring(0, 2)} >{this.state.bill.repsVote}</span>;
    }
    else {
      repVoted = <span>?</span>;
    }
    
    return (
      <div>
          <div className="fixed-header white-bg-color opacity">
            <div className="centered-container">
              <div className="sub-h2">swipe what you'd vote</div>
            </div>
            <div className="voting-indicators">
              <div className="no" onClick={this.handleRBtnClick} className={this.state.redBtnToggle}><i className="fa fa-caret-left"></i>  no</div>
              <div className="yes" onClick={this.handleGBtnClick} className={this.state.greenBtnToggle}>yes  <i className="fa fa-caret-right"></i></div>
            </div>
            <div className="progress-bar">
              <div className="no-votes"></div>
              <div className="yes-votes"></div>
            </div>
          </div>
          
          <div className="wrapper-w-header">
            <div className="centered-container">
              <div className="top-h2">BILL {this.state.bill.id}</div>
              <p>Latest status in parliament:</p>
              <div className="sub-h2 dynamic">{this.state.bill.status}</div>
            </div>
            
            <div className="share">
              <a className={this.state.shareButtonToggle ? "facebookButton fbtn share facebook fa-2x" : "hidden"} href="http://www.facebook.com/sharer/sharer.php?u=http://citizenly.herokuapp.com"><i className="fa fa-facebook"></i></a>
              <i onClick={this.handleShareButtonClick} className= {"shareButton fa fa-share-alt fa-2x"}></i>
              <a className={this.state.shareButtonToggle ? "twitterButton fbtn share twitter fa-2x" : "hidden"} href="https://twitter.com/intent/tweet?text=I found out me and my MP vote the same on 39% of all bills they vote on&url=http://www.facebook.com/sharer/sharer.php?u=http://citizenly.herokuapp.com&via=CITIZEN"><i className="fa fa-twitter"></i></a>
            </div>
            
            {this.state.loading ? <div className="loading"><p>Fetching bill info</p><div className="loader">Loading...</div></div> : null}
            
            <div className="centered-container">
              <div className="sub-h2">title/summary</div>
              <p>{this.state.bill.title}</p>
              <p>{this.state.bill.summary}</p>
            </div>
            <br/>
            <div className="centered-container">
              <div className="sub-h2">full text</div>
              <a href={this.state.bill.textUrl} activeClassName="active">
                <p>See full info</p>
              </a>
            </div>
            <br/>
            <p>{this.state.bill.text}</p>
            
          </div>
          
          <div className="bill-info fixed-footer">
              <div className="one-line-spread">
                <p>Bill status: </p>
                <p className="dynamic">{this.state.bill.status}</p>
              </div>
              <div className="one-line-spread">
                <p>My representative voted: </p>
                <p>{repVoted}</p>
              </div>
              <div className="one-line-spread">
                <p>Proposed by: </p>
                <p>{this.state.bill.proposedBy} - {this.state.bill.partyOfSponsor}</p>
              </div>
          </div>
      
    </div>
  );
}
});

module.exports = withRouter(SingleBill);

// Old code for getting the full text of the bill - not working
//   <div className="box-wrap">
//     <div id="box">
//       <table id="billText"><tbody><tr dangerouslySetInnerHTML={{__html: (this.state.content)}}/></tbody></table>
//     </div>
//   </div>