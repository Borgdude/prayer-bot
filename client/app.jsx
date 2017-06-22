var React = require('react');
var ReactDOM = require('react-dom');
var {Router, IndexRoute, browserHistory} = require('react-router');
import routes from './routes.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

require("style!css!sass!./styles/main.scss");

ReactDOM.render(
  <MuiThemeProvider>
    <Router history={browserHistory} routes={routes} />
  </MuiThemeProvider>,
  document.getElementById('app')
);
