var React = require('react');
//var Link = require('react-router').Link;

// Developer constructor
var Dev = React.createClass({
  render: function() {
    return (
      <div>
        <h2>{this.props.firstName} {this.props.lastName}</h2>
        <a href={this.props.github} target="_blank"><i className="fa fa-github" aria-hidden="true"></i></a>
        <a href={this.props.website} target="_blank"><i className="fa fa-code" aria-hidden="true"></i></a>
        <a href={this.props.linkedin} target="_blank"><i className="fa fa-linkedin" aria-hidden="true"></i></a>
        <a href={this.props.twitter} target="_blank"><i className="fa fa-twitter" aria-hidden="true"></i></a>
        <p>{this.props.desc}</p>
      </div>
    );
  }
});

var About = React.createClass({
  getInitialState: function() {
    // set inital state to determine which list of bills is displayed - active by default
    return {
      dev: [{
        firstName: "Marie-Eve",
        lastName: "Gauthier",
        github: 'https://github.com/Marie-EveGauthier',
        website: '',
        linkedin: 'https://www.linkedin.com/in/marie-eve-gauthier-8467a0106/en',
        twitter: '',
        desc: "awesome human being"
      }, {
        firstName: "Osa",
        lastName: "Isacson",
        github: 'https://github.com/osaisacson',
        website: '',
        linkedin: 'https://www.linkedin.com/in/%C3%A5sa-isacson-86308934',
        twitter: '',
        desc: "awesome human being"
      }, {
        firstName: "Alex",
        lastName: "Ruaux",
        github: 'https://github.com/molecularcode/',
        website: 'http://molecularcodewebdesign.com/',
        linkedin: 'https://ca.linkedin.com/in/alexandraruaux',
        twitter: 'https://twitter.com/molecularcode',
        desc: "Web developer, 3D printing enthusiast, scientist, gamer and geek in training."
      }]
    };
  },
  renderDevs: function(dev) {
    return (
      <li key={dev.lastName}>
        <Dev firstName={dev.firstName} lastName={dev.lastName} github={dev.github} website={dev.website} linkedin={dev.linkedin} twitter={dev.twitter} desc={dev.desc}/>
      </li>
    );
  },
  render: function() {
    return (

      <div>
        <h1>About</h1>
        <p>An awesome political accountability app, designed and developed as part of <a href="https://www.decodemtl.com/" target="_blank">DecodeMTL</a> by:</p>
        
        <ul>
          {this.state.dev.map(this.renderDevs)}
        </ul>
        
        And a very special thank you to Michael Mulley, who built the API and website <a href="https://api.openparliament.ca/" target="_blank">openparliament.ca</a>, without which this project would have been 100x more difficult.
        
      </div>
    );
  }
});

module.exports = About;