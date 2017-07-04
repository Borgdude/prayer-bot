var React = require('react');
var ReactDOM = require('react-dom');
var {Router, Route, IndexRoute, browserHistory} = require('react-router');
import routes from './routes.js';
import Auth from './api/Auth';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import createPalette from 'material-ui/styles/palette';
import { blueGrey, amber, red } from 'material-ui/styles/colors';
var Main = require('./components/Main.jsx');
var PrayFor = require('./components/PrayFor.jsx');
var Prayers = require('./components/Prayers.jsx');
var LoginPage = require('./containers/LoginPage.jsx');
var SignupPage = require('./containers/SignupPage.jsx');
var PrayerManager = require('./components/PrayerManager.jsx')
var TokenForm = require('./components/TokenForm.jsx')
var SignUpFinal = require('./components/SignUpFinal.jsx')
var PrayedForPage = require('./components/PrayedForPage.jsx')
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const theme = createMuiTheme({
  overrides: {
    MuiCard: {
      root: {
        borderRadius: 4
      }
    },
    MuiButton: {
      raised: {
        backgroundColor: 'white'
      }
    }
  },
  palette: createPalette({
    primary: blueGrey, // Purple and green play nicely together.
    accent: red,
    error: red,
  }),
});

require("style!css!sass!./styles/main.scss");

var requireAuth = function(nextState, replaceState){
  if(!Auth.isUserAuthenticated()){
    replaceState({ nextPathname: nextState.location.pathname }, '/login')
  }
}

var requireVerify = function(nextState, replaceState){
  if(!localStorage.getItem('verified')){
    replaceState({ nextPathname: nextState.location.pathname }, '/login')
  }
}

var logout = function(nextState, replaceState){
  Auth.deauthenticateUser();
  window.location.reload();

  replaceState("/");
}

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Router history={browserHistory}>
      <Route path="/" component={Main}>
        <Route path="login" component={LoginPage}/>
        <Route path="signup" component={SignupPage}/>
        <Route path="logout" onEnter={logout}/>
        <Route path="manage" component={PrayerManager}/>
        <Route path="profile" component={PrayedForPage} onEnter={requireAuth}/>
        <Route path="verify/:uid" component={TokenForm}/>
        <Route path="signupfinal/:uid" component={SignUpFinal} onEnter={requireVerify}/>
        <IndexRoute component={Prayers}/>
      </Route>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('app')
);
