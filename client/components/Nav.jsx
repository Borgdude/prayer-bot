import React from 'react';
import { AppBar } from 'react-toolbox';
import { Layout, Drawer, Panel, Sidebar } from 'react-toolbox';

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
      <Layout>
        <Drawer active={this.state.drawerActive}
                   permanentAt='xxl'
                   onOverlayClick={ this.toggleDrawerActive }>
          <div style={{marginTop: '3.5em', padding:'1rem'}}>
            Navigation, account switcher, etc. go here.
          </div>
        </Drawer>
        <Panel>
          <AppBar
             leftIcon='menu'
             onLeftIconClick={ this.toggleDrawerActive }
             title="Prayer-bot"
             fixed/>
           <div style={{ marginTop:'2rem', padding: '1.8rem' }}>
              {this.props.content}
          </div>
        </Panel>
      </Layout>
    );
  }
});

module.exports = Nav;
