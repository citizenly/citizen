/* global localStorage */

var Link = require('react-router').Link;
var React = require('react');
// required for ajax calls
var axios = require('axios');


var Stats = React.createClass({
  getInitialState: function() {
    // set inital state as an empty object, to be populated with rep info on componentDidMount
    return {
      rep: {
        name: "",
        constituency: "",
        province: "",
        party: "",
        img: "",
      },
      repLowest: {
        name: "Stephen Harper",
        constituency: "Calgary Heritage",
        province: "AB",
        party: "Conservative",
        img: "https://api.openparliament.ca/media/polpics/132_1.jpg",
      },
      repHighest: {
        name: "Julie Dabrusin",
        constituency: "Toronto—Danforth",
        province: "ON",
        party: "Liberal",
        img: "https://openparliament.ca/media/polpics/_thumbs/julie-dabrusin_jpg_142x230_autocrop_q85.jpg",
      },
      shareButtonToggle: false,
      facebookButton: "",
      twitterButton: "",
    };
  },
  componentDidMount: function() {
    var that = this;
    // get rep info using nameFormatted in url
    var nameFormatted = localStorage.getItem('repName');
    console.log(nameFormatted, 'nameFormatted');
    axios.post('/repinfoget', {
      repName: nameFormatted
    })
    
    // update this.state with the rep object
    .then(function(response) {
      var updateData = that.state.rep;
      updateData = response.data;
      console.log(updateData, 'updateData');
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
  render: function() {
    console.log(this.state.rep.repName, 'this.state.rep.repName');
    if(!!this.state.rep.name) {
      var myRep =
        <div>
          <h1>34%</h1>
          <img src={this.state.rep.img}></img>
          <h2>{this.state.rep.name}</h2>
          <p><span className={"party" + this.state.rep.party.substring(0, 3)}>{this.state.rep.party}</span> MP for {this.state.rep.constituency} {this.state.rep.province}</p>
        </div>;
    }
    else {
      myRep = 
      <div>
        <h1>?</h1>
        <img src="images/silhouette.jpg" style={{border: "1px solid #ccc"}}></img>
        <h2>unknown</h2>
        <p>please <Link to="/">enter your postal code</Link> or <Link to="/login">log in</Link> to find your representative</p>
      </div>;
    }
    return (
      
      <div className="statsPage">
          <h3>See how your representative measures up against others across the country.</h3>
          <h2>MATCH</h2>
          <p>Shows the match in % between how the below voted, and how the people they represent would have voted.</p>

          <div className="statsMatch">
          
                <div>
                  <h1 className="dynamicNo">19%</h1>
                  <img src={this.state.repLowest.img} />
                  <h2>{this.state.repLowest.name}</h2>
                  <p><span className={"party" + this.state.repLowest.party.substring(0, 3)}>{this.state.repLowest.party}</span> MP for {this.state.repLowest.constituency} {this.state.repLowest.province}</p>
                </div>
          
                {myRep}
            
                <div>
                  <h1 className="dynamicYe">65%</h1>
                  <img src={this.state.repHighest.img} />
                  <h2>{this.state.repHighest.name}</h2>
                  <p><span className={"party" + this.state.repHighest.party.substring(0, 3)}>{this.state.repHighest.party}</span> MP for {this.state.repHighest.constituency} {this.state.repHighest.province}</p>
                </div>
          
          </div>
          <div className="shareFooter">
            <div className="onlyFbTwShare">
              <div className="share">
                <a className={this.state.shareButtonToggle ? "facebookButton fbtn share facebook fa-2x" : "hidden"} href="http://www.facebook.com/sharer/sharer.php?u=http://citizenly.herokuapp.com"><i className="fa fa-facebook"></i></a>
                <i onClick={this.handleShareButtonClick} className= {"shareButton fa fa-share-alt fa-2x"}></i>
                <a className={this.state.shareButtonToggle ? "twitterButton fbtn share twitter fa-2x" : "hidden"} href="https://twitter.com/intent/tweet?text=I found out how well my MP actually represents me&url=http://citizenly.herokuapp.com&via=CITIZEN"><i className="fa fa-twitter"></i></a>
              </div>
            </div>
          </div>
          
      </div>

    );
  }
});

module.exports = Stats;


/////IN CASE WE NEED A SEARCH OR TAGS IN THE FUTURE////////
/*
         <div className="searchbox">
            <input ref="search" className="searchinput " type="text" name="search" maxLength="20" placeholder="Search for comparison by word, eg daycare, streets..." />
          </div>
  
          <div className="compareTags">
              <div><Link activeClassName="active" to="/petitions/active">new</Link></div>
              <div><Link activeClassName="active" to="/petitions/hot">hot</Link></div>
              <div><Link activeClassName="active" to="/petitions/passed">passed</Link></div>
              <div><Link activeClassName="active" to="/petitions/failed">failed</Link></div>
              <div><Link activeClassName="active" to="/petitions/mine">mine</Link></div>
              <div><Link activeClassName="active" to="/petitions/all">all</Link></div>
          </div>*/