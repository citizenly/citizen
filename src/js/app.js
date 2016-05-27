var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
//var Link = ReactRouter.Link;
var IndexRoute = ReactRouter.IndexRoute;
var browserHistory = ReactRouter.browserHistory;



var App = require('./components/Main.js');
var Home = require('./components/Home.js');
var About = require('./components/About.js');
var Rep = require('./components/Rep.js');
var Compare = require('./components/Compare.js');
var Petitions = require('./components/Petitions.js');
var Petition = require('./components/Petition.js');
var Feed = require('./components/Feed.js');
var Bills = require('./components/Bills.js');
var Bill = require('./components/Bill.js');
var Login = require('./components/Login.js');
var NotFound = require('./components/404.js');


// -----------------------------------------------------------------------------
// Middleware
// -----------------------------------------------------------------------------



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
      <Route path="compare" component={Compare}/>
      <Route path="petitions" component={Petitions}/>
      <Route path="petition" component={Petition}/>
      <Route path="feed" component={Feed}/>
      <Route path="bills/:filter" component={Bills}/>
      <Route path="bill/:billId" component={Bill}/>
      <Route path="login" component={Login}/>
      <Route path="*" component={NotFound}/>
    </Route>
  </Router>
);

// If this line of code is not here, nothing gets displayed!
ReactDOM.render(routes, document.querySelector('#app'));