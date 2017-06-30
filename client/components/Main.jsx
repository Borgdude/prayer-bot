import React, { Component } from 'react';
import { Grid } from 'react-flexbox-grid';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Nav from './Nav.jsx'
import { IndexLink, Link } from 'react-router';
import Auth from '../api/Auth';

var AccButtons = React.createClass({
  render: function(){
    if (Auth.isUserAuthenticated()){
      return(<Link style={{textDecoration: 'none'}} to="/logout"><Button color="contrast">Logout</Button></Link>)
    } else {
      return(
        <div>
          <Link style={{textDecoration: 'none'}} to="/login"><Button color="contrast">Login</Button></Link>
          <Link style={{textDecoration: 'none'}} to="/signup"><Button color="contrast">Sign up</Button></Link>
        </div>
      )
    }
  }
});


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
      <div className="app">
        <Drawer 
            docked={false}
            open={this.state.drawerActive}
            onRequestClose={this.toggleDrawerActive}
            onClick={this.toggleDrawerActive}
            style={{
              width: "255px"
            }}
          >
            <List style={{width: "255px"}}>
              <IndexLink style={{textDecoration: 'none'}} to="/">
                <ListItem button>
                  <ListItemText primary="Home" />
                </ListItem>
              </IndexLink>
              <Link style={{textDecoration: 'none'}} to="/profile">
                <ListItem button>
                  <ListItemText primary="Profile" />
                </ListItem>
              </Link>
            </List>
          </Drawer>
          <AppBar position="static">
            <Toolbar>
              <IconButton onClick={this.toggleDrawerActive}color="contrast" aria-label="Menu">
                <MenuIcon />
              </IconButton>
              <Typography type="title" color="inherit" style={{flex: 1}}>Prayer-bot</Typography>
              <div style={{textAlign: 'left'}}>
                <AccButtons />
              </div>
            </Toolbar>
          </AppBar>
        <Grid fluid className="main-container">
          <Nav content={this.props.children}/>
        </Grid>
      </div>
    );
  }
})

module.exports = Main;
