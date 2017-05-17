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

  render: function() {
    return(
      <div>
        <div className="prayercard">
          <h2>{this.props.content}</h2>
          <h3>Submitted: {this.returnFormatedDate(this.props.date)}</h3>
        </div>
        <div className="prayercard-buttons">
          <Button onClick={this.onPrayedClick} icon="check" label="Prayed For" raised primary />
        </div>
      </div>

    );
  }
});


module.exports = PrayerCard;