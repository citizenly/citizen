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
    console.log(this.props.params.repName, 'this.props.params.repName')
    return (
    <div className="repPage">
    <h3>Hello {this.state.user.firstName}, you are being represented by:</h3>
      <div className="rep-container">
        <div className="repInfo">
          <div className="repPic">
            <img src={this.state.rep.img} />
          </div>
          <div className="repText">
            <h2>{this.state.rep.name}</h2>
            <p><span className={"party" + this.state.rep.party.substring(0, 3)}>{this.state.rep.party}</span> MP for {this.state.rep.constituency} {this.state.rep.province}</p>
            <p>Won in 2015 with {this.state.rep.electedVote}% of the vote</p>
          </div>
        </div>
        <div className="borderForRepStats">
        <h3>Percentage of how often they vote the same as...</h3>
        <div className="rep-stats-container">
          <div className="repstatsbackgroundcolor">
            <div className="neighbours">
              <h2>Your neighbours</h2>
              <h1>34%</h1>
            </div>
            <div className="you">
            <Link className="you" activeClassName="active" to ="/compare/votedonbymyrep">
            <h2>you</h2>
            <h1>{this.state.coherence.length > 1 ? this.state.coherence : '?'}</h1>
            </Link>
            </div>
          </div>
          <div id="seperator"></div>
          <div className="down"></div>
          </div>
          <div className="onlyFbTwShare">
            <a className={this.state.shareButtonToggle ? "facebookButton fbtn share facebook fa-2x" : "hidden"} href="http://www.facebook.com/sharer/sharer.php?u=http://citizenly.herokuapp.com"><i className="fa fa-facebook"></i></a>
            <i onClick={this.handleShareButtonClick} className= {"shareButton fa fa-share-alt fa-2x"}></i>
            <a className={this.state.shareButtonToggle ? "twitterButton fbtn share twitter fa-2x" : "hidden"} href="https://twitter.com/intent/tweet?text=I found out how well my MP actually represents me&url=http://citizenly.herokuapp.com&via=CITIZEN"><i className="fa fa-twitter"></i></a>
          </div>
        </div>
        <div className="actionButton rep">
          <Link activeClassName="active" onClick={this.onMenuItemClick} to="/about">About</Link>
          <Link activeClassName="active" onClick={this.onMenuItemClick} to="/">Logout</Link>
        </div>
      </div>
    </div>
    );
  }
});

module.exports = Rep;