import React, { Component } from 'react';
import { Grid } from 'react-flexbox-grid';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Nav from './Nav.jsx'
import { IndexLink, Link } from 'react-router';
import Auth from '../api/Auth';

class AccButtons extends Component {
  static muiName = 'FlatButton';
  
  render() {
      if(Auth.isUserAuthenticated()){
        return (
          <FlatButton label="Log Out"/>
        );
      } else{
        return (
          <div>
            <Link to="/login"><FlatButton className="nav-link" label="Log In"/></Link>
            <Link to="/signup"><FlatButton className="nav-link" label="Sign Up"/></Link>
          </div>
        );
      }

  }
}

// AccButtons.muiName = 'FlatButton';

var Main = React.createClass({
  getInitialState: function() {
    return {
      drawerActive: false
    }
  },

  toggleDrawerActive: function () {
        this.setState({ drawerActive: !this.state.drawerActive });
  },

  render: function(){
    return(
      <div>
        <Drawer 
            docked={false}
            width={255}
            open={this.state.drawerActive}
            onRequestChange={(drawerActive) => this.setState({drawerActive})}
          >
            <IndexLink className="menu-link" to="/"><MenuItem onTouchTap={this.toggleDrawerActive}>Home Page</MenuItem></IndexLink>
            <Link className="menu-link" to="/prayfor"><MenuItem onTouchTap={this.toggleDrawerActive}>Pray For Thing</MenuItem></Link>
          </Drawer>
          <AppBar
              onLeftIconButtonTouchTap={ this.toggleDrawerActive }
              title="Prayer-bot"
              iconElementRight={ 
                Auth.isUserAuthenticated() ?
                <FlatButton label="Log Out"/>
                : (
                <div>
                  <FlatButton label="Log In"/>
                  <FlatButton label="Sign Up"/>
                </div>
                )
               }
              />
        <Grid fluid className="main-container">
          <Nav content={this.props.children}/>
        </Grid>
      </div>
    );
  }
})

module.exports = Main;
