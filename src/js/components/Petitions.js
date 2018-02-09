var React = require('react');
var Link = require('react-router').Link;
// required for ajax calls
var axios = require('axios');
import { withRouter } from 'react-router';


// Petition constructor
var Petitions = React.createClass({
  
  render: function() {
    return (
      <div className="petitionsPage">
          <h3>Below are petitions proposed by the public.</h3>
          <p>You can agree/disagree, or <Link activeClassName="active" to ="/petitionform">create your own petition</Link>. Once a petition has 100 people agreeing with it, it gets sent to your representative.</p>
          
          {/*<div className="searchbox">
            <input ref="search" className="searchinput " type="text" name="search" maxLength="20" placeholder="Search for petition by word, eg daycare, streets..." />
            </div>*/} 
          
          <div className="filters">
              <div><Link activeClassName="active" to="/petitions/active">new</Link></div>
              <div><Link activeClassName="active" to="/petitions/hot">hot</Link></div>
              <div><Link activeClassName="active" to="/petitions/passed">sent</Link></div>
              <div><Link activeClassName="active" to="/petitions/failed">failed</Link></div>
              <div><Link activeClassName="active" to="/petitions/mine">mine</Link></div>
              <div><Link activeClassName="active" to="/petitions/all">all</Link></div>
          </div>
          
          <div className="list">
          <div className="listedItem">
         <Link to="/singlepetition">
         <h4><b>e-119</b></h4>
          <h4>keywords: Citizenship, Immigration, Adoption</h4>
         <h5>Canadian citizenship</h5>
         </Link>
         </div>
        <div className="listedItem">
         <Link to="/petition2">
         <h4><b>e-270</b></h4>
        <h4>keywords: Atlantic salmon, Retaining ponds, Water quality</h4>
        <h5>Aquaculture</h5>
        </Link>
        </div>
        <div className="listedItem">
         <Link to="/petition3">
         <h4><b>e-263</b></h4>
        <h4>keywords: Freedom, Hospitals, Medical assistance in dying, Mental health, Young people</h4>
         <h5>Assisted Suicide</h5>
         </Link>
        </div>
        <div className="listedItem">
         <Link to="/petition4">
         <h4><b>e-337</b></h4>
          <h4>keywords: Bank of Canada, Government borrowing, Interest rates</h4>
          <h5>Bank of Canada</h5>
         </Link>
         </div>
          <div className="listedItem">
         <Link to="/petition5">
         <h4><b>e-18</b></h4>
        <h4>keywords: Decriminalization, Marijuana, Possession of a controlled substance</h4>
         <h5> Cannabis </h5>
         </Link>
          </div>
          </div>
            <div className="actionButton petitions">
            <Link activeClassName="active" to ="/petitionform">New</Link>
            </div>
          
        {/*  
        <div className="petitionList">
            {this.state.loading ? <p>Please wait while we find all petitions...</p> : null}
            <div>
              {this.state.petitionList !== [] ? this.state.petitionList.map(this.renderPetitions) : 'We will have more filters coming soon'}
            </div>
        </div> 
        */}
          
     </div>
    );
  }
});

module.exports = Petitions;



