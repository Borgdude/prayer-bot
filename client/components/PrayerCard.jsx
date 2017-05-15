import React from 'react';
import {Button, IconButton} from 'react-toolbox/lib/button';

const PrayerCard = React.createClass({

  returnFormatedDate: function(string){
    var d = new Date(string);
    return d.toDateString();
  },


  render: function() {
    return(
      <div>
        <div className="prayercard">
          <h2>{this.props.content}</h2>
          <h3>Submitted: {this.returnFormatedDate(this.props.date)}</h3>
        </div>
        <div className="prayercard-buttons">
          <Button onClick={this.props.prayedFor} icon="check" label="Prayed For" raised primary />
          <Button icon="clear" label="Skip Prayer" raised accent />
        </div>
      </div>

    );
  }
});


module.exports = PrayerCard;