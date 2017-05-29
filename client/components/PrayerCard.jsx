import React from 'react';
import {Button, IconButton} from 'react-toolbox/lib/button';

const PrayerCard = React.createClass({

  returnFormatedDate: function(string){
    var d = new Date(string);
    return d.toDateString();
  },

  onPrayedClick: function(e){
    e.preventDefault();
    console.log("Button clicked");
    
    this.props.prayedFor();
  },

  handleClick: function(){
    alert(this.props.prayerID);
  },

  render: function() {
    return(
      <div className="prayercard">
        <div className="prayer-info">
          <h2>{this.props.content}</h2>
          <h3>Submitted: {this.returnFormatedDate(this.props.date)}</h3>
        </div>
        <div>
          <p>Prayed for: {this.props.prayedForNumber} times</p>
          <Button onClick={this.handleClick} label="Prayed For" raised />
        </div>
      </div>
    );
  }
});


module.exports = PrayerCard;