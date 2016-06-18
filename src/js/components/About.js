var React = require('react');
//var Link = require('react-router').Link;

// Developer constructor
var Dev = React.createClass({
  render: function() {
    return (
      <div className="dev">
        <h2>{this.props.firstName} {this.props.lastName}</h2>
         {this.props.github.length > 0 ? <a href={this.props.github} target="_blank"><i className="fa fa-github" aria-hidden="true"></i></a> : ""}
          {this.props.website.length > 0 ? <a href={this.props.website} target="_blank"><i className="fa fa-code" aria-hidden="true"></i></a> : ""}
          <a href={this.props.linkedin} target="_blank"><i className="fa fa-linkedin" aria-hidden="true"></i></a>
          {this.props.twitter.length > 0 ? <a href={this.props.twitter} target="_blank"><i className="fa fa-twitter" aria-hidden="true"></i></a> : ""}
        <p>{this.props.desc}</p>
      </div>
    );
  }
});

var About = React.createClass({
  getInitialState: function() {
    return {
      dev: [{
        firstName: "Marie-Eve",
        lastName: "Gauthier",
        github: 'https://github.com/Marie-EveGauthier',
        website: '',
        linkedin: 'https://www.linkedin.com/in/marie-eve-gauthier-8467a0106/en',
        twitter: '',
        desc: "Back-end developer of citizen, full-stack developer in training. Was previously a French teacher in Spain. Loves digging into languages (from ancient Greek to javascript)"
      }, {
        firstName: "Osa",
        lastName: "Isacson",
        github: 'https://github.com/osaisacson',
        website: '',
        linkedin: 'https://www.linkedin.com/in/%C3%A5sa-isacson-86308934',
        twitter: '',
        desc: "'Citizen' concept, design, front-end. Was with the UN in Nairobi for six years - 'Citizen' results from experience within this context. Last years been working on how the agency can develop the online potential of its worldwide partner networks. Architect by training, dabbles in UX/UI design and big ideas."
      }, {
        firstName: "Alex",
        lastName: "Ruaux",
        github: 'https://github.com/molecularcode/',
        website: 'http://molecularcodewebdesign.com/',
        linkedin: 'https://ca.linkedin.com/in/alexandraruaux',
        twitter: 'https://twitter.com/molecularcode',
        desc: "Full-stack developer, 3D printing enthusiast, scientist, gamer and geek in training."
      }]
    };
  },
  renderDevs: function(dev) {
    return (
      <div key={dev.lastName}>
        <Dev firstName={dev.firstName} lastName={dev.lastName} 
        github={dev.github} website={dev.website} linkedin={dev.linkedin} twitter={dev.twitter} desc={dev.desc}/>
      </div>
    );
  },
  render: function() {
    return (
      <div>
        <div className="aboutPage">
          <h1>About</h1>
          <p className="aboutIntro">An awesome political accountability app, designed and developed as part of <a href="https://www.decodemtl.com/" target="_blank">DecodeMTL</a> by:</p>
          <div className="allDevs">
            {this.state.dev.map(this.renderDevs)}
          </div>
        </div>
  
        <p className="thankYou">And a very special thank you to Michael Mulley, who built the API and website <a href="https://api.openparliament.ca/" target="_blank">openparliament.ca</a>, without which this project would have been 100x more difficult.</p>
      </div>
    );
  }
});

module.exports = About;