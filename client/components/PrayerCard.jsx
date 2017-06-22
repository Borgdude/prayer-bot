import React from 'react';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Auth from '../api/Auth.js';
var prayerService = require('../api/prayerService');

const PrayerCard = React.createClass({
  getInitialState: function(){
    return {
      prayedForNumber: this.props.prayedForNumber
    }
  },

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
    var that = this;
    if(Auth.isUserAuthenticated()){
      prayerService.incrementOnePrayer(that.props.prayerID).then(function(data){
        that.setState({
          prayedForNumber: data.prayedForNumber
        });
      }, function(err){
        alert(err);
      });
    } else {
      alert('You have to be logged in before you start doing anything!');
    }
  },

  render: function() {
    return(
      <Card className="card">
        <div className="prayer-info">
          <h2>{this.props.content}</h2>
          <h3>Submitted: {this.returnFormatedDate(this.props.date)}</h3>
        </div>
        <div>
          <p>Prayed for: {this.state.prayedForNumber} times</p>
          <RaisedButton onTouchTap={this.handleClick} label="Prayed For" />
        </div>
      </Card>
    );
  }
});


module.exports = PrayerCard;