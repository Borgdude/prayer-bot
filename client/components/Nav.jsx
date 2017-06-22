import React from 'react';

var Nav = React.createClass({
  render: function() {
    return (
        <div style={{ marginTop:'2rem'}}>
            {this.props.content}
        </div>
    );
  }
});

module.exports = Nav;
