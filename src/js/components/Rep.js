/* global localStorage */
var React = require('react');
var Link = require('react-router').Link;
// required for ajax calls
var axios = require('axios');
var Parse = require('parse');
var $ = require('jquery');
var IndexLink = require("react-router").IndexLink;
import { withRouter } from 'react-router';
var event = require('../events.js');
//var Vote = Parse.Object.extend('Vote');


var Rep = React.createClass({
  getInitialState: function() {
    // set inital state as an empty object, to be populated with rep info on componentDidMount
    return {
      hansard: {
        topic: "Healthcare",
        title: "Business of the house: Diabetes",
        comment: "Does my hon. Friend agree that groups such as the Bristol South Diabetes Support Group are really important in bringing together volunteers to support people across the country? Does she support those volunteers, who not only supplement the work of the NHS but give people the confidence to manage their work?",
        agree: "",
        disagree: "",
      },
      rep: {
        name: "",
        constituency: "",
        province: "",
        party: "",
        img: "",
        electedYear: "",
        electedVote: ""
      },
      coherence: '',
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
      redBtnToggle: "redbutton"
    };
  },
  componentDidMount: function() {
    var that = this;
    that.setState({rep: that.props.location.state.allRepData});

    // get rep info using nameFormatted in url
    // axios.post('/repinfoget', {
    //   repName: nameFormatted
    // })
    // update this.state with the rep object
    // .then(function(response) {
      // var updateData = ourBloodyRepData;
      // console.log('GAH ourBloodyRepData', ourBloodyRepData)
      // that.state.rep = updateData;
      // localStorage.setItem("repFullName", that.state.rep.name);
      // localStorage.setItem("repName", that.props.params.repName);
      // that.setState({rep: updateData});
    // })
    // .catch(function(response) {
    // });

    // Get array of repVote objects - billId and ballot
    // var repVotes = axios.post('/repvoteinfo', {
    //   repName: nameFormatted
    // }).then(
    //   function(res) {
    //     var voteArray = res.data.map(function(vote){
    //       return {
    //         ballot: vote.ballot,
    //         billId: vote.billId
    //       };
    //     });
    //     console.log(voteArray);
    //     return voteArray;
    //   }
    // );
    
    // // Get array of myVote objects - billId and vote
    // var myVotes = Parse.Cloud.run('myVoteInfo').then(console.log(myVotes));
    
    // //var that = this;
    // Promise.all([repVotes, myVotes]).then(
      
    //   function(results) {
    //     var repVotes = results[0];
    //     var myVotes = results[1];

    //     // Compare Rep and User array of votes and create a single array, with 1 = agreement and 0 = disagreement
    //     var voteCompare = [];

    //     myVotes.forEach(function(userVote) {
    //       repVotes.forEach(function(repVote) {
    //         if ((userVote.get('billId') === repVote.billId) && (repVote.ballot !== "Didn't Vote")) {
    //           if ((userVote.get('vote') === 1 && repVote.ballot === "Yes") || (userVote.get('vote') === -1 && repVote.ballot === "No")) {
    //             return voteCompare.push(1);
    //           }
    //           else {
    //             return voteCompare.push(0);
    //           }
    //         }
    //       });
    //     });

    //     var total = voteCompare.length;
    //     if (total > 0) {
    //       var sum = voteCompare.reduce(function(cur, next){return cur+next;});
    //       var coherence = ((sum/total)*100).toFixed(1);

    //       that.setState({coherence: coherence + '%'});
    //     }
    //   }
    // )
    // .catch(
    //   function(err) {
    //     console.log(err);
    // });
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
    console.log(this.props, 'this.props');
    console.log(this.state, 'this state');
    // Representative Link
    var repLink;
    var feedLink;
    var repName = localStorage.getItem('repName');
    if (repName) {
      repLink = '/rep/'+repName;
      feedLink = '/rep/'+repName+'/feed';
    }
    else {
      repLink = '/';
      feedLink = '/';
    }
    return (
    <div className="repPage">
      <div className="centered-container">
        <div className="top-h2">{this.state.rep.full_name}</div>
        <div className="sub-h2">SPEAKS FOR YOU</div>
        <Link activeClassName="active" to={repLink}>
          <img src="https://api.parliament.uk/Live/photo/qMlFiE3L.jpeg?crop=MCU_3:4&width=260&quality=80" alt="" className="left-side-pic-link" />
        </Link>
        <div className="percent-low red-color">-4%</div>
        <img src={'https://www.theyworkforyou.com/' + this.state.rep.image} alt="https://api.openparliament.ca/media/polpics/marc-miller.jpg" className="round-image" />
        <Link activeClassName="active" to ="/repbetter">
          <img src="https://api.openparliament.ca/media/polpics/alexandra-mendes.jpg" alt="" className="right-side-pic-link" />
        </Link>
        <div className="percent-high green-color">+5%</div>
        <div className={"party" + this.state.rep.party.substring(0, 3)}>{this.state.rep.party}</div>

        <div className="white-bg-section">
          <p>{this.state.rep.constituency}</p>
          <p>Entered house {this.state.rep.entered_house} <br/>through {this.state.rep.entered_reason}</p>
        </div>
        
        <div className="back-line"></div>

        <div className="bubble-container-large">
          <div className="light-grey-bg-color top-bubble">
              <Link className="you" activeClassName="active" to ="/compare/votedonbymyrep">
              <div className="bubble-text">you agree</div>
              <div className="bubble-value red-color">{this.state.coherence.length > 1 ? this.state.coherence : '17'}<span className="percent red-color">%</span></div>
              </Link>
          </div>
          <div className="compare bottom-bubble bubble-button">
              <Link activeClassName="active" to ="/compare/votedonbymyrep">
              <div className="bubble-button-text">COMPARE 9/35</div>
              </Link>
          </div>
        </div>
        
        <div className="back-line"></div>
        
        <div className="centered-container hansard-statement-box">
          <div className="sub-h2 dynamic">{this.state.hansard.topic}</div>
        </div>
        
        <div className="back-line"></div>
        
        <div className="centered-container hansard-statement-box">
          <div onClick={this.handleRBtnClick} className={this.state.redBtnToggle}></div>
          <div className="hansard-content">
            <p>{this.state.hansard.title}</p><br/>
            <p>{this.state.hansard.comment}</p>
          </div>
          <div onClick={this.handleGBtnClick} className={this.state.greenBtnToggle}></div>
        </div>
        
        <div className="back-line"></div>
        
        <div className="centered-container hansard-statement-box">
          <div onClick={this.handleRBtnClick} className={this.state.redBtnToggle}></div>
          <div className="hansard-content">
            <p>{this.state.hansard.title}</p><br/>
            <p>{this.state.hansard.comment}</p>
          </div>
          <div onClick={this.handleGBtnClick} className={this.state.greenBtnToggle}></div>
        </div>


        
        <div className="back-line"></div>
        <div className="bubble-container-x-small">
          <Link activeClassName="active" className="light-grey-bg-color full-bubble" onClick={this.onMenuItemClick} to="/">Logout</Link>
        </div>  
        
        </div>
      </div>
    );
  }
});

module.exports = Rep;

// <div className="bill-status-box">
//   <span>Agreement</span>
//   <div className={this.state.vote === -1 ? "dynamicNo" : this.state.vote === 1 ? "dynamicYe" : "?"}>{this.state.vote === -1 ? "No" : this.state.vote === 1 ? "Yes" : "?"}</div>
// </div>


// <div className="bubble-container-x-small">
//   <Link activeClassName="active" className="light-grey-bg-color full-bubble" onClick={this.onMenuItemClick} to={repLink}>Home</Link>
// </div>


// <div className="bubble-container-medium">
//   <div className="light-grey-bg-color top-bubble">
//       <Link className="you" activeClassName="active" to="/rep/marc-miller/feed">
//       <div className="bubble-value">{this.state.coherence.length > 1 ? this.state.coherence : '10'}</div>
//       <div className="bubble-text">new statements</div>
//       </Link>
//   </div>
//   <div className="feed bottom-bubble bubble-button">
//       <Link activeClassName="active" to ={feedLink}>
//       <div className="bubble-button-text">CHECK</div>
//       </Link>
//   </div>
// </div>

// <div className="back-line"></div>

// <div className="bubble-container-small">
//   <div className="light-grey-bg-color top-bubble">
//       <Link className="you" activeClassName="active" to ="/petitions">
//       <div className="bubble-value">{this.state.coherence.length > 1 ? this.state.coherence : '3'}</div>
//       <div className="bubble-text">new petitions</div>
//       </Link>
//   </div>
//   <div className="petitions bottom-bubble bubble-button">
//       <Link activeClassName="active" to ="/petitions">
//       <div className="bubble-button-text">ENGAGE</div>
//       </Link>
//   </div>
// </div>