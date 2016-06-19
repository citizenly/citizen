var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var browserHistory = ReactRouter.browserHistory;
require('../scss/app.scss');

// Setup connection to parse server
var Parse = require('parse');
Parse.initialize("XYZ");
Parse.serverURL = '/parse';

window.Parse = Parse;

var App = require('./components/Main.js');
var Home = require('./components/Home.js');
var About = require('./components/About.js');
var Rep = require('./components/Rep.js');
var Stats = require('./components/Stats.js');
var Petitions = require('./components/Petitions.js');
var Petition1 = require('./components/Petition1.js');
var Petition2 = require('./components/Petition2.js');
var Petition3 = require('./components/Petition3.js');
var Petition4 = require('./components/Petition4.js');
var Petition5 = require('./components/Petition5.js');
var PetitionForm = require('./components/PetitionForm.js');
var Feed = require('./components/Feed.js');
var Compare = require('./components/Compare.js');
var Bill = require('./components/Bill.js');
var Login = require('./components/Login.js');
var Signup = require('./components/Signup.js');
var NotFound = require('./components/404.js');


// -----------------------------------------------------------------------------
// The routes
// -----------------------------------------------------------------------------
/* This section says:
  - If the route starts with /, load the App component
  - If the route is /, load the Home component INSIDE App as this.props.children
  - If the route is /order, load the Order component INSIDE App as this.props.children
  - etc...
  - If the route is anything else, load the NotFound component INSIDE App as this.props.children

The whole process lets us create **complex, nested user interfaces** with minimal effort, by simply nesting `Route` components. */
var routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="about" component={About}/>
      <Route path="rep/:repName" component={Rep}/>
      <Route path="stats" component={Stats}/>
      <Route path="petitions" component={Petitions}/>
      <Route path="petition1" component={Petition1}/>
      <Route path="petition2" component={Petition2}/>
      <Route path="petition3" component={Petition3}/>
      <Route path="petition4" component={Petition4}/>
      <Route path="petition5" component={Petition5}/>
      <Route path="petitionform" component={PetitionForm}/>
      <Route path="rep/:repName/feed" component={Feed}/>
      <Route path="compare/:filter" component={Compare}/>
      <Route path="bill/:billId" component={Bill}/>
      <Route path="login" component={Login}/>
      <Route path="signup" component={Signup}/>
      <Route path="*" component={NotFound}/>
    </Route>
  </Router>
);

// If this line of code is not here, nothing gets displayed!
ReactDOM.render(routes, document.querySelector('#app'));
