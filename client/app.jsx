var React = require('react');
var ReactDOM = require('react-dom');
var {Route, Router, IndexRoute, hashHistory} = require('react-router');
var Main = require('./components/Main.jsx');
var Members = require('./components/Members.jsx');
var PrayFor = require('./components/PrayFor.jsx');

require("style!css!sass!./styles/main.scss");

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Main}>
      <Route path="prayfor" component={PrayFor}/>
      <IndexRoute component={Members}/>
    </Route>
  </Router>,
  document.getElementById('app')
);
