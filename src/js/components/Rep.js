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
      loggedIn: !!Parse.User.current(),
      rep: {
        name: "",
        constituency: "",
        province: "",
        party: "",
        img: "",
        electedYear: "",
        electedVote: ""
      },
       user: {   //placeholder, to be connected to our internal user database.
        firstName: "*John*", 
        lastName: "*Bain*",
      },
      coherence: '',
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
      localStorage.setItem("repName", that.props.params.repName);
      that.setState({rep: updateData});
    })
    .catch(function(response) {
    });

    // Get array of repVote objects - billId and ballot
    var repVotes = axios.post('/repvoteinfo', {
      repName: nameFormatted
    }).then(
      function(res) {
        var voteArray = res.data.map(function(vote){
          return {
            ballot: vote.ballot,
            billId: vote.billId
          };
        });
        console.log(voteArray);
        return voteArray;
      }
    );
    
    // Get array of myVote objects - billId and vote
    var myVotes = Parse.Cloud.run('myVoteInfo').then(console.log(myVotes));
    
    //var that = this;
    Promise.all([repVotes, myVotes]).then(
      
      function(results) {
        var repVotes = results[0];
        var myVotes = results[1];

        // Compare Rep and User array of votes and create a single array, with 1 = agreement and 0 = disagreement
        var voteCompare = [];

        myVotes.forEach(function(userVote) {
          repVotes.forEach(function(repVote) {
            if ((userVote.get('billId') === repVote.billId) && (repVote.ballot !== "Didn't Vote")) {
              if ((userVote.get('vote') === 1 && repVote.ballot === "Yes") || (userVote.get('vote') === -1 && repVote.ballot === "No")) {
                return voteCompare.push(1);
              }
              else {
                return voteCompare.push(0);
              }
            }
          });
        });

        var total = voteCompare.length;
        if (total > 0) {
          var sum = voteCompare.reduce(function(cur, next){return cur+next;});
          var coherence = ((sum/total)*100).toFixed(1);

          that.setState({coherence: coherence + '%'});
        }
      }
    )
    .catch(
      function(err) {
        console.log(err);
    });
  },
  handleShareButtonClick: function(e) {
    e.preventDefault();
    this.setState({
      shareButtonToggle: !this.state.shareButtonToggle
    });
  },
 /* For now, we put the date of the last election to be in 2015 because for some of the MPs, the openparliament API gives us the date of the first time he/she was elected instead of the date of the last election. That is the way to refer to the date get from the openparliament API :{this.state.rep.electedYear} */
  render: function() {
    console.log(this.props, 'this.props');
    
    return (
    <div className="repPage">
      <div className="centered-container">
      
        <div className="top-h2">{this.state.rep.name}</div>
        <div className="sub-h2">SPEAKS FOR YOU</div>
        
        <img src={this.state.rep.img} alt="" className="round-image" />
        
        <div className={"party" + this.state.rep.party.substring(0, 3)}>{this.state.rep.party}</div>
        
        <p>{this.state.rep.constituency} {this.state.rep.province}</p>
        <p>Won in 2015 with {this.state.rep.electedVote}% of the vote</p>

        <div className="back-line"></div>

        <div className="bubble-container-large">
          <div className="dark-grey-bg-color top-bubble">
              <Link className="you" activeClassName="active" to ="/compare/votedonbymyrep">
              <div className="bubble-text">you agree</div>
              <div className="bubble-value">{this.state.coherence.length > 1 ? this.state.coherence : '38%'}</div>
              </Link>
          </div>
          <div className="compare bottom-bubble bubble-button">
              <Link activeClassName="active" to ="/compare/votedonbymyrep">
              <div className="bubble-button-text">COMPARE</div>
              </Link>
          </div>
        </div>
        
        <div className="back-line"></div>

        <div className="bubble-container-medium">
          <div className="dark-grey-bg-color top-bubble">
              <Link className="you" activeClassName="active" to="/rep/marc-miller/feed">
              <div className="bubble-value">{this.state.coherence.length > 1 ? this.state.coherence : '10'}</div>
              <div className="bubble-text">new statements</div>
              </Link>
          </div>
          <div className="feed bottom-bubble bubble-button">
              <Link activeClassName="active" to ="/compare/votedonbymyrep">
              <div className="bubble-button-text">CHECK</div>
              </Link>
          </div>
        </div>
        
        <div className="back-line"></div>

        <div className="bubble-container-small">
          <div className="dark-grey-bg-color top-bubble">
              <Link className="you" activeClassName="active" to ="/petitions">
              <div className="bubble-value">{this.state.coherence.length > 1 ? this.state.coherence : '3'}</div>
              <div className="bubble-text">new petitions</div>
              </Link>
          </div>
          <div className="petitions bottom-bubble bubble-button">
              <Link activeClassName="active" to ="/compare/votedonbymyrep">
              <div className="bubble-button-text">ENGAGE</div>
              </Link>
          </div>
        </div>

        </div>
        <div className="actionButton rep">
          <Link activeClassName="active" onClick={this.onMenuItemClick} to="/">Logout</Link>
        </div>
      </div>
    );
  }
});

module.exports = Rep;