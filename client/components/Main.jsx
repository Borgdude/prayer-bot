import React from 'react';

import Nav from './Nav.jsx'

var Main = (props) =>{
  return(
      <div>
        <Nav content={props.children}/>
      </div>
  );
}

module.exports = Main;
