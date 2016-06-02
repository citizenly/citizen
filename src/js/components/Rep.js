/* global localStorage */
var React = require('react');
var Link = require('react-router').Link;
// required for ajax calls
var axios = require('axios');
var Parse = require('parse');
var $ = require('jquery');
//var Vote = Parse.Object.extend('Vote');


var Rep = React.createClass({
  getInitialState: function() {
    // set inital state as an empty object, to be populated with rep info on componentDidMount
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
      repVotes: [],
      myVotes: [
        {billId: 'C-14', vote: -1},
        {billId: 'C-7', vote: 1},
        {billId: 'C-10', vote: 1},
        {billId: 'C-6', vote: 1},
        {billId: 'C-15', vote: 1},
        {billId: 'C-2', vote: 1},
        {billId: 'C-9', vote: 1},
        {billId: 'C-8', vote: 1},
        {billId: 'C-4', vote: 1},
        {billId: 'C-3', vote: 1},
      ],
      coherence: 0,
      shareButtonToggle: false,
      facebookButton: "",
      twitterButton: "",
    };
  },
  componentDidMount: function() {
    var that = this;
    var nameFormatted = this.props.params.repName;
    
    // get rep info using nameFormatted in url
    axios.post('/repinfoget', {
      repName: nameFormatted
    })
    // update this.state with the rep object
    .then(function(response) {
      var updateData = that.state.rep;
      updateData = response.data;
      that.state.rep = updateData;
      localStorage.setItem("repFullName", that.state.rep.name);
      that.setState({rep: updateData});
    })
    .catch(function(response) {
    });



    // rep object //
    // array of data from rep object
    // query DB for user info => array
    //math
    
    
    // Get array of repVote objects - billId and ballot
    axios.post('/repvoteinfo', {
      repName: nameFormatted
    })
    .then (function(res) {
      var voteArray = [];
      var repVote = {};
      res.data.forEach(function(vote){
        repVote = {
          ballot: vote.ballot,
          billId: vote.billId
        };
        voteArray.push(repVote);
      });
      that.setState({repVotes:voteArray});
    })
    .catch(function(res) {
      console.log(res, 'repVoteObj error');
    });
  },
  componentDidUpdate: function() {
    // Get array of myVotes objects - billId and vote
    //Parse.Cloud.run('myVoteInfo').then(function(votes) {
    // SETSTATE ON THE ARRAY 
    //});
    
    // Compare Rep and User array of votes and create a single array, with 1 = agreement and 0 = disagreement
    var myVotes = this.state.myVotes;
    var repVotes = this.state.repVotes;
    var voteCompare = [];
    
    myVotes.forEach(function(user) {
      repVotes.forEach(function(rep) {
        if ((user.billId === rep.billId) && (rep.ballot !== "Didn't Vote")) {
          if ((user.vote === 1 && rep.ballot === "Yes") || (user.vote === -1 && rep.ballot === "No")) {
            return voteCompare.push(1);
          }
          else {
            return voteCompare.push(0);
          }
        }
      });
    });

    var total = voteCompare.length;
    var sum = voteCompare.reduce(function(cur, next){return cur+next;});
    var coherence = ((sum/total)*100).toFixed(1);

    this.setState({coherence: coherence});
  },
  handleShareButtonClick: function(e) {
    e.preventDefault();
    this.setState({
      shareButtonToggle: !this.state.shareButtonToggle
    });
  },
  render: function() {
    // console.log(this.state.myVotes, 'myVotes');
    // console.log(this.state.repVotes, 'repVotes');
    // console.log(this.state.voteCompare, 'voteCompare');
    return (
    <div>
      <div className="rep-container">

        <div className="rep-info">
          <div className="rep-pic">
            <img src={this.state.rep.img} />
          </div>
      
          <div className="rep-text">
            <p>You are being represented by:</p>
            <h2>{this.state.rep.name}</h2>
            <p><span className={"party" + this.state.rep.party.substring(0, 3)}>{this.state.rep.party}</span> MP for {this.state.rep.constituency} {this.state.rep.province}</p>
            <p>Won in {this.state.rep.electedYear} with {this.state.rep.electedVote}% of the vote</p>
          
          </div>
          
      </div>
      
      <div className="rep-stats-container">
        
          <div className="agreement">
            <h2>In agreement with...</h2>
          </div>
          
          <div className="repstatsbackgroundcolor">
              <div className="neighbours">
                <h2>neighbours</h2>
                <h1>34%</h1>
              </div>
              
              <div className="you">
                <h2>you</h2>
                <h1>{this.state.coherence}%</h1>
              </div>
          </div>
          
          <div className="intheirvoting">
            <h2>... in their voting.</h2>
          </div>
          <div id="seperator"></div>
          <div className="down"></div>
      
          <div className="share">
            <a className={this.state.shareButtonToggle ? "facebookButton fbtn share facebook fa-2x" : "hidden"} href="http://www.facebook.com/sharer/sharer.php?u=https://citizen-iblameyourmother.c9users.io/rep/helene-laverdiere"><i className="fa fa-facebook"></i></a>
            <i onClick={this.handleShareButtonClick} className= {"shareButton fa fa-share-alt fa-2x"}></i>
            <a className={this.state.shareButtonToggle ? "twitterButton fbtn share twitter fa-2x" : "hidden"} href="https://twitter.com/intent/tweet?text=I found out how well my MP actually represents me&url=YOUR-URL&via=CITIZEN"><i className="fa fa-twitter"></i></a>
          </div>
              
        </div>
      </div>
      
    <div id="content">
      <footer>
          <div className="bottomMenu-item compare">
            <Link to="/compare" activeClassName="active">COMPARE</Link>
          </div>
          <div className="bottomMenu-item petitions">
            <Link to="/petitions" activeClassName="active">PETITIONS</Link>
          </div>
          <div className="bottomMenu-item feed">
            <Link to="/feed" activeClassName="active">WHAT THEY'RE DOING</Link>
          </div>
          <div className="bottomMenu-item bills">
            <Link to="/bills/active" activeClassName="active">WHAT WOULD YOU DO?</Link>
          </div>
       </footer>
    </div>
  </div>
    );
  }
});

module.exports = Rep;