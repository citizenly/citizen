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
var countryData = [{color: "#006729", value: 150, label: "AGREE"}, {color: "#8B2530", value: 10, label: "DISAGREE"}, {color: "rgba(0,0,0,0.5)", value: 200, label: "REMAINING"}]


var SinglePetition = React.createClass({
  getInitialState: function() {
    // set inital state as an empty object, to be populated with bill info on componentDidMount
    return {
      petition: {
        id: 'e-119',
        title: 'Canadian citizenship',
        summary: 'Whereas: Changes to citizenship regulations have created a two-tiered citizenship system in Canada for adopted children that discriminates against children who have been granted citizenship through the direct route by not allowing them to pass on citizenship to their birth children if born outside of Canada. We, the undersigned, citizens of Canada, call upon the House of Commons to: 1. Amend the citizenship regulations for children who are adopted outside of Canada to ensure that they are treated equally regardless of whether they are granted citizenship through the direct route or the naturalization process; and 2. Request that amendments are made to protect adopted children so other governments in the future cannot strip adopted children of their inalienable rights as Canadian citizens.',
        proposedBy: 'Graeme Ball',
        sponsor: 'Nathaniel Erskine-Smith', //For a petition to be valid it needs to have a sponsor (for example your MP). Future functionality: Feed the proposed petitions to your MP, who can choose which ones to sponsor. If they click they'll sponsor it, it becomes active on the petitions page. ALTERNATIVELY adding the 'sponsor' could be in the very final stage, where the petition receives 100 supporters and gets sent to the MP, who gets the choice of sponsoring it. If he/she doesnt, despite the fact that 100 of their constituents would like them to, then we could make this fact visible in a list under 'petitions' (petitions sent to MP (sponsored, not sponsored).
        dateOpen: "2015-06-11",
        dateClose: "2016-06-11",
        daysLeft: "34"/*NUMBER (diff between dateOpen and dateClose)*/,
        keywords: "Citizenship, Immigration, International adoption",
        comments: "Start the discussion"
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
      this.setState({content: this.state.petition.comments});
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
            <div className="petitionPage">
              <div className="petitionandid">
                <h1>Petition  <span className="petitionnumber">{this.state.petition.id}</span></h1>
              </div>
              <div className="tagDescriptions">
                <p>Keywords: <span className="dynamic">{this.state.petition.keywords}</span></p>
              </div>
              <div className="tagDescriptions">
                <p> <span className="dynamic">{this.state.petition.daysLeft}</span> Days left</p>
              </div>
          </div>
          <div className="petitionTabs">
            <ul>
              <li id="tab-1" onClick={this.handleTabClick.bind(this, 1)}>Topic</li>
              <li id="tab-2" onClick={this.handleTabClick.bind(this, 2)}>Summary</li>
              <li id="tab-3" onClick={this.handleTabClick.bind(this, 3)}>Neighbour comments</li>
            </ul>
    
          	<div className="box-wrap">
            	<div id="box">
            	  <p>{this.state.content}</p>
            	</div>
            </div>
          </div>
        
        </div>
        
      <div className="legends">
          <h3 className="petitionNo">Disagree</h3>
          <h3 className="petitionGrey">Remaining</h3>
          <h3 className="petitionYes">Agree</h3>
      </div>
        
        <div className="petitionChartContainer">
          <div className="petitionVoteComparison">
            <DoughnutChart className="petitionDoughnut" data={countryData} options={{animateRotate: true, animation: true, responsive: true}} width="200" height= "200" />
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

module.exports = withRouter(SinglePetition);

