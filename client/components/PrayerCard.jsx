import React from 'react';
import {Button, IconButton} from 'react-toolbox/lib/button';
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
      <div className="card">
        <div className="prayer-info">
          <h2>{this.props.content}</h2>
          <h3>Submitted: {this.returnFormatedDate(this.props.date)}</h3>
        </div>
        <div>
          <p>Prayed for: {this.state.prayedForNumber} times</p>
          <Button onClick={this.handleClick} label="Prayed For" raised />
        </div>
      </div>
    );
  }
});


module.exports = PrayerCard;