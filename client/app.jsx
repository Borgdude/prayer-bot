var React = require('react');
var ReactDOM = require('react-dom');
var {Router, IndexRoute, browserHistory} = require('react-router');
import routes from './routes.js';

require("style!css!sass!./styles/main.scss");

ReactDOM.render(
  <Router history={browserHistory} routes={routes} />,
  document.getElementById('app')
);
