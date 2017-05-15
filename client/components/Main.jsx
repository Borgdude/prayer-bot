import React from 'react';
import { Grid } from 'react-flexbox-grid';
import Nav from './Nav.jsx'

var Main = (props) =>{
  return(
      <Grid fluid className="main-container">
        <Nav content={props.children}/>
      </Grid>
  );
}

module.exports = Main;
