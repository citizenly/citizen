/*global localStorage*/
var React = require('react');
var Link = require('react-router').Link;

// required for ajax calls
var axios = require('axios');
var $ = require('jquery');
import { withRouter } from 'react-router';


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
      voteInText: "Not voted yet",
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
    /*Parse.Cloud.run('findMyVote', {billId: this.props.params.billId}).then(function(vote) {
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
    });*/
    
    var vote = this.getUserVote();
    
    if (vote === 1) {
      that.setState({
        greenBtnToggle: "greenbutton-clicked",
        redBtnToggle: "inactive-button",
        vote: 1
      });
    }
    if (vote === -1) {
      that.setState({
        greenBtnToggle: "inactive-button",
        redBtnToggle: "redbutton-clicked",
        vote: -1
      });
    }
  },
  handleGBtnClick: function(e) {
    e.preventDefault();
    var vote = {billId: this.props.params.billId};
    
    if (this.state.greenBtnToggle === "greenbutton") {
      this.setState({greenBtnToggle:"greenbutton-clicked", redBtnToggle:"inactive-button", vote: 1});
      vote.vote = 0;
      //Parse.Cloud.run('handleVote',  vote);
    }
    if (this.state.greenBtnToggle === "inactive-button") {
      this.setState({greenBtnToggle:"greenbutton-clicked", redBtnToggle:"inactive-button", vote: 1});
      vote.vote = 1;
      //Parse.Cloud.run('handleVote', vote);
    }
    if (this.state.greenBtnToggle === "greenbutton-clicked") {
      this.setState({greenBtnToggle:"greenbutton", redBtnToggle:"redbutton", vote: 0});
      vote.vote = 1;
      //Parse.Cloud.run('handleVote', vote);
    }
    
    this.saveUserVote(vote);
  },
  handleRBtnClick: function(e) {
    e.preventDefault();
    var vote = {billId: this.props.params.billId};
    if (this.state.redBtnToggle === "redbutton") {
      this.setState({redBtnToggle:"redbutton-clicked", greenBtnToggle: "inactive-button", vote: -1});
      vote.vote = 0;
      //Parse.Cloud.run('handleVote', vote);
    }
    if (this.state.redBtnToggle === "inactive-button") {
      this.setState({redBtnToggle:"redbutton-clicked", greenBtnToggle: "inactive-button", vote: -1});
      vote.vote = 0;
      //Parse.Cloud.run('handleVote', vote);
    }
    if (this.state.redBtnToggle === "redbutton-clicked") {
      this.setState({redBtnToggle:"redbutton", greenBtnToggle:"greenbutton", vote: 0});
      vote.vote = -1;
      //Parse.Cloud.run('handleVote', vote);
    }
    
    this.saveUserVote(vote);
  },
  handleShareButtonClick: function(e) {
    e.preventDefault();
    
    this.setState({
      shareButtonToggle: !this.state.shareButtonToggle
    });
  },
  saveUserVote: function(vote) {
    var billId = vote.billId;
    var value = vote.vote;
    
    window.localStorage.setItem(`bill-vote_${billId}`, value);
  },
  getUserVote: function() {
    var {billId} = this.props.params;
    
    var vote = window.localStorage.getItem(`bill-vote_${billId}`);
    
    if (vote) {
      return Number(vote);
    } else {
      return 0;
    }
  },
  render: function() {
    console.log(this.state.bill, 'this.state.bill');

    if (this.state.bill.repsVote) {
      var repVoted = <div className={"dynamic" + this.state.bill.repsVote.substring(0, 2)} >{this.state.bill.repsVote}</div>;
    }
    else {
      repVoted = <div>?</div>;
    }
    
    var repLink;
    var repName = localStorage.getItem('repName');
    if (repName) {
      repLink = '/rep/'+repName;
    }
    else {
      repLink = '/';
    }
    
    return (
      <div>
          <div className="scrollable-content">
            <div className="centered-container bill-main-headings">
              <div className="bubble-container-x-small">
                <Link activeClassName="active" className="light-grey-bg-color full-bubble" to={repLink}>Home</Link>
              </div>
              <div className="top-h2">BILL {this.state.bill.id}</div>
              <p>Latest status in parliament:</p>
              <div className="sub-h2 dynamic">{this.state.bill.status}</div>
            </div>
            <div className="centered-container">
             <div className="one-line-spread">
                <p>Proposed by: </p>
                <p>{this.state.bill.proposedBy} - {this.state.bill.partyOfSponsor}</p>
              </div>
            </div>
            <br/>
            
            {this.state.loading ? <div className="loading"><p>Fetching bill info</p><div className="loader">Loading...</div></div> : null}
            
            <div className="centered-container">
              <div className="sub-h2">title/summary</div>
              <p>{this.state.bill.title}</p>
              <p>{this.state.bill.summary}</p>
            </div>

            <div className="centered-container">
              <div className="sub-h2">full text</div>
              <a href={this.state.bill.textUrl} activeClassName="active">
                <p>See full info</p>
              </a>
            </div>
            <p>{this.state.bill.text}</p>
            <br/>
            <br/>
          </div>
          <div className="bill-status">
              <div className="bill-status-box">
                <span>My rep voted</span>
                {repVoted}
              </div>
              <div className="bill-status-box">
                <span>You would have voted</span>
                <div className={this.state.vote === -1 ? "dynamicNo" : this.state.vote === 1 ? "dynamicYe" : "?"}>{this.state.vote === -1 ? "No" : this.state.vote === 1 ? "Yes" : "?"}</div>
              </div>
            </div>
          <div className="footer">
            <div className="bill-info">
              <div className="centered-container">
                <div className="sub-h2">click what you'd vote</div>
              </div>
              <div className="voting-indicators">
                <div onClick={this.handleRBtnClick} className={this.state.redBtnToggle}>no</div>
                <div onClick={this.handleGBtnClick} className={this.state.greenBtnToggle}>yes</div>
              </div>
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


    // <div className="share">
    //   <a className={this.state.shareButtonToggle ? "facebookButton fbtn share facebook fa-2x" : "hidden"} href="http://www.facebook.com/sharer/sharer.php?u=http://citizenly.herokuapp.com"><i className="fa fa-facebook"></i></a>
    //   <i onClick={this.handleShareButtonClick} className= {"shareButton fa fa-share-alt fa-2x"}></i>
    //   <a className={this.state.shareButtonToggle ? "twitterButton fbtn share twitter fa-2x" : "hidden"} href="https://twitter.com/intent/tweet?text=I found out me and my MP vote the same on 39% of all bills they vote on&url=http://www.facebook.com/sharer/sharer.php?u=http://citizenly.herokuapp.com&via=CITIZEN"><i className="fa fa-twitter"></i></a>
    // </div>