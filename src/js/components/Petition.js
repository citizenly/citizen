var React = require('react');
//var Link = require('react-router').Link;
// required for ajax calls
var axios = require('axios');
var $ = require('jquery');


var Petition = React.createClass({
  getInitialState: function() {
    // set inital state as an empty object, to be populated with petition info on componentDidMount
    return {
      show: "title",
      petition: {
        id: "**ID**",
        author: "**Jody Wilson-Raybould**",
        title: "**Better street lighting on Rue Saint Hubert**",
        description: "**Lorem ipsum dolor sit amet, fuisset similique omittantur vix ex. Eu assum dolore has. Iudico decore est ad, ei vix porro meliore. Eu mel viderer fuisset offendit, te solum atqui deserunt vel. In iudico nonumy assentior pri. Quas semper ponderum an vim. Eam vocent omittantur at, agam omnis cu duo. Posidonium elaboraret duo ad, te vix audire fuisset percipit. Ne ius etiam impedit sapientem, an sea sonet gubergren, vis ei duis malorum denique. Inani convenire persequeris vel an. Tritani nonumes dignissim mei cu, nam vero tantas abhorreant no, quo commodo diceret pericula in. Sit an modo graece invidunt, vis ex liber maluisset. Sit eu viderer facilis, pri cu ipsum primis sadipscing. Vis at ubique tamquam vituperatoribus, corpora ullamcorper comprehensam id vix, est ei sale latine. Et vim laudem vituperatoribus, nec vidisse mediocrem ex, ea qui tale saperet interpretaris. Ad pri euripidis forensibus, his tota eruditi docendi an. Te mel purto reprimique, ornatus detracto adversarium pri no. Ea natum fuisset pro, autem temporibus vis an, an nec errem fastidii. In eos viderer accusamus corrumpit, pro ne alterum consetetur, vel possit diceret ei. Ad eros fuisset eos, eu legimus invidunt qui. Ne nobis scaevola ius, suas graece accusamus an pri. Modus animal usu in.**",
        neighbourComments: "**Lots of text**",
        dateOpen: "**2016-05-12**",
        dateClose: "**2016-05-12**",
        daysLeft: "**17**"//NUMBER (diff between dateOpen and dateClose)
      },
      content: "",
    };
  },

  componentDidMount: function() {
    var that = this;
    // get petition info using id passed from previous screen
    var id = this.props.params.id;
    axios.post('/petitioninfoget', {
      id: id
    })
    // update this.state with the petition object
    .then(function(response) {
      var updateData = that.state.petition;
      updateData = response.data;
       that.setState({petition: updateData});
    })
    .catch(function(response) {
    });
    this.setState({content: this.state.petition.title});
  },
  handleTabClick: function(data){
    
    if(data===1) {
      this.setState({content: this.state.petition.title});
    }
    else if(data===2) {
      this.setState({content: this.state.petition.description});
    }
    else if(data===3) {
      this.setState({content: this.state.petition.neighbourComments});
    }
    
    $(".petitionTabs li").removeClass("active");
    $("#tab-" + data).addClass("active");
    
  },

  render: function() {
    return (
 
 <div>
    <div>
        <div>
          <div className="petitionInfo">
            <div className="petitions-heading">
            Petitions
            </div>
            
            <div className="petitionandid">
                <h3>petition</h3>             
                <h2>{this.state.petition.id}</h2>
            </div>
            
            <div className="petitionTags">
                  <div>**new**</div>
                  <div>**hot**</div>
                  <div>**author**</div>
            </div>
          </div>
        </div>
        
        <div className="daysLeftAndNumber">
            <div>{this.state.petition.daysLeft}</div>
            <div>Days Left</div>
          </div>

        <div className="petitionTabs">
          <ul>
            <li id="tab-1" onClick={this.handleTabClick.bind(this, 1)}>Title</li>
            <li id="tab-2" onClick={this.handleTabClick.bind(this, 2)}>Description</li>
            <li id="tab-3" onClick={this.handleTabClick.bind(this, 3)}>Neighbour Comments</li>
          </ul>

      		<div className="box-wrap">
        		<div id="box">
        		  <p>{this.state.content}</p>
        		</div>
        	</div>
        	
        </div>
            
        <div className="pollCompare">
          <div><p>**Whole Country**</p></div>
          <div><p>**Your Neighbours**</p></div>
        </div>

        </div>
      
        <div className="pollingButtons">
        
          <div className="leftarrow">
              <img alt="left" src="images/arrowleft.png"></img>
          </div>
                  
          <div className= "redhand">
              <img alt="no" src="images/red button.png"></img>
          </div>
          
           <div className= "share">
              <img alt="share" src="images/twitter-logo.jpg"></img>
          </div>
          
          <div className= "greenhand">
              <img alt="yes" src="images/green button.png"></img>
          </div>
          
          <div className="rightarrow">
              <img alt="right" src="images/arrowright.png"></img>
          </div>
          
        </div>
        
    </div>
    );
  }
});

module.exports = Petition;