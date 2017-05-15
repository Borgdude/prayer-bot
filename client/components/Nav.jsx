import React from 'react';
import { AppBar } from 'react-toolbox';
import { Layout, Drawer, Panel, Sidebar } from 'react-toolbox';
import { Grid, Row, Col } from 'react-flexbox-grid';

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
            Navigation, account switcher, etc. go here.
          </div>
        </Drawer>
          <AppBar
             leftIcon='menu'
             onLeftIconClick={ this.toggleDrawerActive }
             title="Prayer-bot"
             fixed
             />
           <div style={{ marginTop:'2rem', paddingTop: '1.8rem' }}>
              {this.props.content}
          </div>
      </Layout>
    );
  }
});

module.exports = Nav;
