/* global localStorage */

var React = require('react');
var Link = require('react-router').Link;
// required for ajax calls
var axios = require('axios');



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
      shareButtonToggle: false,
      facebookButton: "",
      twitterButton: "",
    };
  },
  componentDidMount: function() {
    var that = this;
    // get rep info using nameFormatted in url
    var nameFormatted = this.props.params.repName;
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
  },
  handleShareButtonClick: function(e) {
    e.preventDefault();
    this.setState({
      shareButtonToggle: !this.state.shareButtonToggle
    });
  },
 /* For now, we put the date of the last election to be in 2015 because for some of the MPs, the openparliament API gives us the date of the first time he/she was elected instead of the date of the last election. That is the way to refer to the date get from the openparliament API :{this.state.rep.electedYear} */
  render: function() {
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
            <p>Won in 2015 with {this.state.rep.electedVote}% of the vote</p>
          
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
                <h1>?</h1>
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
            <a className={this.state.shareButtonToggle ? "twitterButton fbtn share twitter fa-2x" : "hidden"} href="https://twitter.com/intent/tweet?text=test stuff&url=YOUR-URL&via=TWITTER-HANDLER"><i className="fa fa-twitter"></i></a>
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
            <Link to="/feed/speeches" activeClassName="active">WHAT THEY'RE DOING</Link>
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