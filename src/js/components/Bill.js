/*global localStorage*/
var React = require('react');
// required for ajax calls
var axios = require('axios');
var $ = require('jquery');
import { withRouter } from 'react-router';
var Parse = require('parse');
var Vote = Parse.Object.extend('Vote');
var DoughnutChart = require("react-chartjs").Doughnut;



//HULLO :) the 'value' below is to be replaced with the yes/no votes of the whole country and the yes/no votes of the 'neighbours' (ie constituency).
var countryData = [{color: "#006729", value: 150, label: "YES"}, {color: "#8B2530", value: 50, label: "NO"}]
var neighbourData = [{color: "#4EA32A", value: 150, label: "YES"}, {color: "#D56500", value: 120, label: "NO"}]


var Bill = React.createClass({
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
        date: '' 
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
    if (this.state.bill.repsVote) {
      var repVoted = <span className={"dynamic" + this.state.bill.repsVote.substring(0, 2)} >{this.state.bill.repsVote}</span>;
    }
    else {
      repVoted = <span>?</span>;
    }
    
    return (
      <div>
        <div>
          <div className="billInfo">
            <div className="pageHeading billsHeading">
              What would you do?
            </div>
              
            <div className="billandid">
              <h3>BILL <span className="billnumber">{this.state.bill.id}</span></h3>
            </div>

            <div className="tagDescriptions">
              <p>Bill status: <span className="dynamic">{this.state.bill.status}</span></p>
              <p>My representative voted: {repVoted}</p>
              <p>Proposed by: <span className="dynamic">{this.state.bill.proposedBy}</span>
                <span className={"party" + this.state.bill.partyOfSponsor.substring(0, 3)}> - {this.state.bill.partyOfSponsor}</span>
              </p> 
            </div>

            {this.state.loading ? <div className="loading"><p>Fetching bill info</p><div className="loader">Loading...</div></div> : null}

            <div className="billTabs">
              <ul>
                <li id="tab-1" onClick={this.handleTabClick.bind(this, 1)}>Title</li>
                <li id="tab-2" onClick={this.handleTabClick.bind(this, 2)}>Summary</li>
                <li id="tab-3" onClick={this.handleTabClick.bind(this, 3)}>Full text</li>
              </ul>

              <div className="box-wrap">
                <div id="box">
                  <table id="billText"><tbody><tr dangerouslySetInnerHTML={{__html: (this.state.content)}}/></tbody></table>
                </div>
              </div>
            </div>
          </div>
      </div>

      <div className="legends">
          <h3>what my -</h3>
          <h3 className="cNo">coun</h3>
          <h3 className="cYes">try</h3>
          <h3> & </h3>
          <h3 className="nNo">neigh</h3>
          <h3 className="nYes">bours</h3>
          <h3>- think</h3>
      </div>
      
      <div className="billChartContainer">
        <div className="countryAndNeighboursComparison">
          <DoughnutChart className="bigD" data={countryData} options={{animateRotate: true, animation: true, responsive: true}} width="200" height= "200" />
          <DoughnutChart className="littleD" data={neighbourData} options={{animateRotate: true, animation: true, responsive: true}} width="100" height= "100" />
        </div>
      </div>
      
      <div className="votingAndSharingActions">

        <div onClick={this.handleRBtnClick} className={this.state.redBtnToggle}></div>

        <div className="share">
          <a className={this.state.shareButtonToggle ? "facebookButton fbtn share facebook fa-2x" : "hidden"} href="http://www.facebook.com/sharer/sharer.php?u=http://citizenly.herokuapp.com"><i className="fa fa-facebook"></i></a>
          <i onClick={this.handleShareButtonClick} className= {"shareButton fa fa-share-alt fa-2x"}></i>
          <a className={this.state.shareButtonToggle ? "twitterButton fbtn share twitter fa-2x" : "hidden"} href="https://twitter.com/intent/tweet?text=I found out me and my MP vote the same on 39% of all bills they vote on&url=http://www.facebook.com/sharer/sharer.php?u=http://citizenly.herokuapp.com&via=CITIZEN"><i className="fa fa-twitter"></i></a>
        </div>

        <div onClick={this.handleGBtnClick} className={this.state.greenBtnToggle}>
        </div>
      </div>
    </div>
  );
}
});

module.exports = withRouter(Bill);



/*      <div className="legends">
          <h3>What your </h3> <h3>  </h3>
          <h3 className="cNo">coun</h3>
          <h3 className="cYes">try</h3>
          <h3> and </h3>
          <h3 className="nNo">neigh</h3>
          <h3 className="cYes">bours</h3>
          <h3> think</h3>
      </div>*/