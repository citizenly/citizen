var React = require('react');
var Link = require('react-router').Link;

// bills landing page
var Bills = React.createClass({
  render: function() {
    return (
    	<div className="row">
		<div className="tabbed-area col s12">

			<ul className="tabs group">
			 <li><a href="#box-one">TITLE</a></li>
			 <li><a href="#box-two">SUMMARY</a></li>
			 <li><a href="#box-three">FULL TEXT</a></li>
		    <li><a href="#box-four">HOUSE DEBATE</a></li>
			</ul>
	
		<div className="box-wrap">
	
		<div id="box-one">
		  Title of the bill
		</div>
		
		<div id="box-two">
		  Summary of the bill
		</div>
		
		<div id="box-three">
		  Full text of the bill
		</div>

    <div id="box-four">
		  House debate of the bill
		</div>
		
	</div>
</div>

          <div className="billbuttons-section row">
            <div className="col s3 center">
                    <div className="arrow">
        				arrow
                    </div>
            </div>
            <div className="col s3 center">
                    <div className="button">
        				<img className= "responsive-img" src="images/red button.png"></img>
                    </div>
            </div>
            <div className="col s3 center">
                    <div className="button">
                	 	<img className= "responsive-img" src="images/green button.png"></img>
                    </div>
            </div>
            <div className="col s3 center">
                    <div className="arrow">
        				arrow
                    </div>
            </div>
          </div>
    </div>

    );
  }
});

module.exports = Bills;


