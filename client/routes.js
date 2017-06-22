var Main = require('./components/Main.jsx');
var Members = require('./components/Members.jsx');
var PrayFor = require('./components/PrayFor.jsx');
var Prayers = require('./components/Prayers.jsx');
var LoginPage = require('./containers/LoginPage.jsx');
var SignupPage = require('./containers/SignupPage.jsx');
var PrayerManager = require('./components/PrayerManager.jsx')
import Auth from './api/Auth';


const routes = {
  // base component (wrapper for the whole application).
  component: Main,
  childRoutes: [

    {
      path: '/',
      component: Prayers
    },

    {
      path: '/prayfor',
      component: PrayFor
    },

    {
      path: '/manage',
      component: PrayerManager
    },

    {
      path: '/login',
      component: LoginPage
    },

    {
      path: '/signup',
      component: SignupPage
    },

    {
      path: '/logout',
      onEnter: (nextState, replace) => {
        Auth.deauthenticateUser();

        // change the current URL to /
        replace('/');
      }
    }

  ]
};

export default routes;