var React = require('react');
var ReactDOM = require('react-dom');
var {Route, Router, IndexRoute, hashHistory} = require('react-router');
var Main = require('./components/Main.jsx');
var Members = require('./components/Members.jsx');

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Main}>
      <IndexRoute component={Members}/>
    </Route>
  </Router>,
  document.getElementById('app')
);
