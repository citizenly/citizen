var React = require('react');
//var Link = require('react-router').Link;
// required for ajax calls
var axios = require('axios');


var Bills = React.createClass({
  getInitialState: function() {
    // set inital state as an empty array of objects, to be populated with info on each bill on componentDidMount
    return {
      [{
        id: "**C-14**",
        title: "**An Act to amend the Criminal Code and to make related amendments to other Acts (medical assistance in dying)**",
        status: "**Bill Not Active**",
        lastVote: "**Passed**",
        proposedBy: "**Jody Wilson-Raybould**",
        repsVote: "**Didn't vote**",
        date: "**2016-05-12**"
      },
      {
        id: "**C-10**",
        title: "**An Act to amend the Air Canada Public Participation Act and to provide for certain other measures**",
        status: "**Active**",
        lastVote: "**Failed*",
        proposedBy: "**Marc Garneau **",
        repsVote: "**Yes**",
        date: "**2016-05-11**"
      },
      {
        id: "**C-6**",
        title: "**An Act to amend the Citizenship Act and to make consequential amendments to another Act**",
        status: "**Active**",
        lastVote: "**Passed**",
        proposedBy: "**John McCallum**",
        repsVote: "**No**",
        date: "**2016-05-02**"
      }]
    };
  },
  componentDidMount: function() {
    var that = this;
    // get info for each bill filters by active
    var id = this.props.params.id;
    axios.post('/billsget', {
      id: id
    })
    // update this.state with the bill object
    .then(function(response) {
      var updateData = that.state.bill;
      updateData = response.data;
       that.setState({bill: updateData});
    })
    .catch(function(response) {
      console.log(response);
    });
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var that = this;
    var pc = this.refs.postalcode.value;
    var userPostalCode = formattedPc.validatePC(pc);
    if(userPostalCode === "invalid") {
        this.setState({invalidPostalCode: "alert"});
        event.emit('show_message', {message:"Please, enter a valid postal code"});
    }
    else {
      axios.post('/repnameget', {
        postalcode: userPostalCode
      }).then(function(response) {
        var path = '/rep/' + response.data;
        that.props.router.push(path);
      })
      .catch(function(response) {
        console.log(response, 'response');
      });
    }
  },
  render: function() {
    return (

      <div>
        <div className="billInfo">
          <h3>What would you do?</h3>
          <h1>Bills</h1>
          <div className="billTags">
            <ul>
              <li>{this.state.bill.status}</li>
              <li>{this.state.bill.lastVote}</li>
              <li>{this.state.bill.proposedBy}</li>
            </ul>
          </div>
          <h2>{this.state.bill.id}</h2>
          <h2>My representative voted: {this.state.bill.repsVote}</h2>
        </div>

        <div className="billTabs">
          <ul className="tabs group">
            <li><a href="#box-one">TITLE</a></li>
            <li><a href="#box-two">SUMMARY</a></li>
            <li><a href="#box-three">FULL TEXT</a></li>
            <li><a href="#box-four">HOUSE DEBATE</a></li>
          </ul>

      		<div className="box-wrap">
        		<div id="box-one">
        		  <h3>{this.state.bill.title}</h3>
        		</div>
        		
        		<div id="box-two">
        		  <h3>{this.state.bill.summary}</h3>
        		</div>
        		
        		<div id="box-three">
        		  <h3>{this.state.bill.text}</h3>
        		</div>
        
            <div id="box-four">
        		  <h3>{this.state.bill.houseDebate}</h3>
        		</div>
        	</div>
        	
        </div>
        
        <div className="voteCompare">
          <div><p>**Whole Country**</p></div>
          <div><p>**Your Neighbours**</p></div>
        </div>

        <div className="vottingButtons">
          <div>
            <div className="arrow">
              <p>arrow</p>
            </div>
          </div>
          
          <div>
            <div>
        	  	<img className= "responsive-img" src="images/red button.png"></img>
            </div>
          </div>
          
          <div>
            <div>
          	 	<img className= "responsive-img" src="images/green button.png"></img>
            </div>
          </div>
          
          <div>
            <div className="arrow">
        			<p>arrow</p>
            </div>
          </div>
          
        </div>
      </div>
    );
  }
});

module.exports = Bills;