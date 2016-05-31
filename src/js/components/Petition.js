var React = require('react');
//var Link = require('react-router').Link;
// required for ajax calls
var axios = require('axios');
var $ = require('jquery');
import { withRouter } from 'react-router';

var Parse = require('parse');
var Vote = Parse.Object.extend('Vote');
var DoughnutChart = require("react-chartjs").Doughnut;



//HULLO :) the 'value' below is to be replaced with the yes/no votes to the petition.).
var countryData = [{color: "#006729", value: 150, label: "YES"}, {color: "#8B2530", value: 50, label: "NO"}]


var Petition = React.createClass({
  getInitialState: function() {
    // set inital state as an empty object, to be populated with bill info on componentDidMount
    return {
      petition: {
        id: '**placeholder**',
        title: '**placeholder**',
        summary: '**placeholder**',
        proposedBy: '**placeholder**',
        date: '**placeholder**',
        dateOpen: "**2016-05-12**",
        dateClose: "**2016-06-12**",
        daysLeft: "**17**"/*NUMBER (diff between dateOpen and dateClose)*/,
        keywords: "**streets, healthcare, youth**",
      },
      content: "",
      vote: 0,
      greenGloVetoggle: "greenglovebutton",
      redGloVetoggle: "redglovebutton",
      shareButtonToggle: false,
      facebookButton: "",
      twitterButton: "",
    };
  },
  componentDidMount: function() {
    this.loadPetitionData();
    this.setState({content: this.state.petition.title});
    $(".petitionTabs li").removeClass("active");
    $("#tab-" + 1).addClass("active");
  },
  componentDidUpdate: function(prevProps) {
    if(prevProps.params.filter !== this.props.params.filter) {
      this.loadBillData();
    }
  },
  loadPetitionData: function() {
    var that = this;
    var petitionId = this.props.params.petitionId;
    this.setState({loading: true});
    
    axios.post('/petitioninfoget', {
      petitionId: petitionId
    })
    .then(function(response) {
      that.setState({petition: response.data, loading: false});
    })
    .catch(function(response) {
      console.log(response, 'response');
    });
    
    Parse.Cloud.run('findMyVote', {petitionId: this.props.params.petitionId}).then(function(votePetition) {
      if (votePetition) {
        if (votePetition.get('votePetition') === 1) {
          that.setState({
            greenGloVetoggle: "greenglovebutton-clicked",
            redGloVetoggle: "redglovebutton",
            vote: 1
          });
        }
        else if (votePetition.get('votePetition') === -1) {
          that.setState({
            greenGloVetoggle: "greenglovebutton",
            redGloVetoggle: "redglovebutton-clicked",
            vote: -1
          });
        }
      }
    });
  },
  handleTabClick: function(data){
    if(data===1) {
      this.setState({content: this.state.petition.title});
    }
    else if(data===2) {
      this.setState({content: this.state.petition.summary});
    }
    else if(data===3) {
      this.setState({content: this.state.petition.text});
    }
    
    $(".petitionTabs li").removeClass("active");
    $("#tab-" + data).addClass("active");
  },
  handleGGloVeclick: function(e) {
    e.preventDefault();
    var votePetition = {petitionId: this.props.params.petitionId};
    
    if (this.state.greenGloVetoggle === "greenglovebutton") {
      this.setState({greenGloVetoggle:"greenglovebutton-clicked", redGloVetoggle:"redglovebutton", votePetition: 1});
      votePetition.votePetition = 1;
      Parse.Cloud.run('handleVotePetition',  votePetition);
    }
    else if (this.state.greenGloVetoggle === "greenglovebutton-clicked") {
      this.setState({greenGloVetoggle:"greenglovebutton", votePetition: 0});
      votePetition.votePetition = 0;
      Parse.Cloud.run('handleVotePetition', votePetition);
    }
  },
  handleRGloVeclick: function(e) {
    e.preventDefault();
    var votePetition = {petitionId: this.props.params.petitionId};
    if (this.state.redGloVetoggle === "redglovebutton") {
      this.setState({redGloVetoggle:"redglovebutton-clicked", greenGloVetoggle: "greenglovebutton", votePetition: -1});
      votePetition.votePetition = -1;
      Parse.Cloud.run('handleVotePetition', votePetition);
    }
    else if (this.state.redGloVetoggle === "redglovebutton-clicked") {
      this.setState({redGloVetoggle:"redglovebutton", votePetition: 0});
      votePetition.votePetition = 0;
      Parse.Cloud.run('handleVotePetition', votePetition);
    }
  },
  handleShareButtonClick: function(e) {
    e.preventDefault();
    
    this.setState({
      shareButtonToggle: !this.state.shareButtonToggle
    });

  },

  render: function() {
    return (
      <div>
        <div>
          <div>
            <div className="petitionInfo">
              <div className="petitionHeading">
                Petition
              </div>
                
              <div className="petitionandid">
                <h3>Petition  <span className="petitionnumber">{this.state.petition.id}</span></h3>
              </div>
                
              <div className="tagDescriptions">
                <p>Keywords: <span className="dynamic">{this.state.petition.keywords}</span></p>
                <p> <span className="dynamic">{this.state.petition.daysLeft}</span> Days left</p>
            </div>
          </div>
    
          <div className="petitionTabs">
            <ul>
              <li id="tab-1" onClick={this.handleTabClick.bind(this, 1)}>Title</li>
              <li id="tab-2" onClick={this.handleTabClick.bind(this, 2)}>Summary</li>
              <li id="tab-3" onClick={this.handleTabClick.bind(this, 3)}>Full text</li>
            </ul>
    
          	<div className="box-wrap">
            	<div id="box">
            	  <p>{this.state.content}</p>
            	</div>
            </div>
          </div>
        
        </div>
        
        <div className="chartContainer">
          <div className="petitionVoteComparison">
            <DoughnutChart className="bigD" data={countryData} options={{animateRotate: true, animation: true, responsive: true}} width="200" height= "200" />
          </div>
        </div>
        
        <div className="votingAndSharingActions">
              
          <div onClick={this.handleRGloVeclick} className={this.state.redGloVetoggle}></div>

          <div className="share">
            <a className={this.state.shareButtonToggle ? "facebookButton fbtn share facebook fa-2x" : "hidden"} href="http://www.facebook.com/sharer/sharer.php?u=https://citizen-iblameyourmother.c9users.io/rep/helene-laverdiere"><i className="fa fa-facebook"></i></a>
            <i onClick={this.handleShareButtonClick} className= {"shareButton fa fa-share-alt fa-2x"}></i>
            <a className={this.state.shareButtonToggle ? "twitterButton fbtn share twitter fa-2x" : "hidden"} href="https://twitter.com/intent/tweet?text=test stuff&url=YOUR-URL&via=TWITTER-HANDLER"><i className="fa fa-twitter"></i></a>
          </div>

          <div onClick={this.handleGGloVeclick} className={this.state.greenGloVetoggle}></div>

        </div>
      </div>
  </div>
    );
  }
});

module.exports = withRouter(Petition);
