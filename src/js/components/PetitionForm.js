var React = require('react');
//var Link = require('react-router').Link;
// required for ajax calls
var axios = require('axios');


var PetitionForm = React.createClass({

  render: function() {
    return (
    <div> 
         <div className="petitions-heading">
         petitions
         </div> 
        
            <div className="petitionEntryFields">
                <div><input ref="title" type="text" name="title" maxLength="50" placeholder="The title of your petition. Make it something clear and short." /></div>
                <div><input ref="keywords" className="petitionkeywords" type="text" name="keywords" maxLength="20" placeholder="Enter a couple of keywords that relate to your petition." /></div>
                <div><input ref="description" className="petitiondescription" type="textarea" name="description" maxLength="250" placeholder="Describe what your petition is about." /></div>
                <div><input ref="startdate" className="petitionstart" type="date" name="startdate" maxLength="20" placeholder="Day you want your petition to start" /></div>
                <div><input ref="enddate" className="petitionend" type="date" name="enddate" maxLength="20" placeholder="Day you want your petition to end, max 3 months." /></div>
                <div><input ref="email" className="petitionauthemail" type="email" name="email" maxLength="20" placeholder="Your email, so we can let you know how the petition goes." /></div>
            </div>
    </div> 
    );
  }
});

module.exports = PetitionForm;

