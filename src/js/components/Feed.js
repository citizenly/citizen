var React = require('react');
var Link = require('react-router').Link;
// required for ajax calls
var axios = require('axios');
import { withRouter } from 'react-router';


var Feed = React.createClass({

  render: function() {
    return (
      <div>
      
          <div className="whatTheyreDoingHeading">
            What They're Doing
          </div>
          
          <h3>FEED</h3>
 
          <div className="searchbox">
            <input ref="search" className="searchinput " type="text" name="search" maxLength="20" placeholder="Search what your representative is doing" />
          </div>
  
          <div className="feedTags">
              <div>All</div>
              <div>Votes</div>
              <div>Social</div>
              <div>Speeches</div>
          </div>
          
          <div className="feedList">
            <div>
              {/* This is where the feed is to go */}
            </div>
          </div>
          
     </div>
    );
  }
});

module.exports = Feed;