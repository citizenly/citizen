var React = require('react');
var Link = require('react-router').Link;

// data viz landing page
var Compare = React.createClass({
  render: function() {
    return (
      <div className="comparePage">
          <div className="compareHeading">
            Compare
          </div>
          <p>Find how your representative's statistics compare against other representatives across the country.</p>
          
 

      </div>
    );
  }
});

module.exports = Compare;


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