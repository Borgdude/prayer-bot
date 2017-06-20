import React from 'react';
import AppBar from 'react-toolbox/lib/app_bar';
import Navigation from 'react-toolbox/lib/navigation';
import { Layout, Drawer, Panel, Sidebar } from 'react-toolbox';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { IndexLink, Link } from 'react-router';
import Auth from '../api/Auth.js';

var Nav = React.createClass({
  getInitialState: function() {
    return {
      drawerActive: false
    }
  },

  toggleDrawerActive: function () {
        this.setState({ drawerActive: !this.state.drawerActive });
  },

  render: function() {
    return (
      <Layout style={{maxWidth: '960px'}}>
        <Drawer active={this.state.drawerActive}
                   permanentAt='xxl'
                   onOverlayClick={ this.toggleDrawerActive }>
          <div style={{padding:'1rem'}}>
            <IndexLink onClick={ this.toggleDrawerActive } to="/">Home Page</IndexLink>
            <Link onClick={ this.toggleDrawerActive } to="prayfor">Pray For Thing</Link>
          </div>
        </Drawer>
        <AppBar
            leftIcon='menu'
            onLeftIconClick={ this.toggleDrawerActive }
            title="Prayer-bot"
            fixed
            >
          <Navigation type='horizontal' >
            {Auth.isUserAuthenticated() ? (
              <Link className="nav-link" to="/logout">Log out</Link>
            ) : (
              <div>
                <Link className="nav-link" to="/login">Log in</Link>
                <Link className="nav-link" to="/signup">Sign up</Link>
              </div>
            )}
          </Navigation>
        </AppBar>
        <div style={{ marginTop:'2rem', paddingTop: '1.8rem' }}>
            {this.props.content}
        </div>
      </Layout>
    );
  }
});

module.exports = Nav;
