import React from 'react';
import Card, { CardContent } from 'material-ui/Card';
import Collapse from 'material-ui/transitions/Collapse';
import Button from 'material-ui/Button';
import Auth from '../api/Auth.js';
var prayerService = require('../api/prayerService');

const PrayerCard = React.createClass({
  getInitialState: function(){
    return {
      prayedForNumber: this.props.prayedForNumber,
      open: false,
      expanded: false,
      showDetails: false
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
    prayerService.incrementOnePrayer(that.props.prayerID).then(function(data){
    that.setState({
      prayedForNumber: data.prayedForNumber
    });
    }, function(err){
      alert(err);
    });

    if(Auth.isUserAuthenticated()){
      prayerService.addPrayedFor(that.props.prayerID).then(function(data){
        console.log(data);
      },function(err){
        alert(err);
      });
    } else {
      console.log('OPENED!');
      this.props.onOpen();
    }
  },

  onExpandChange: function(x){
    this.setState({showDetails: x})
  },

  handleExpand: function(){
    var expanded = this.state.expanded;
    this.setState({expanded: !expanded});
  },

  render: function() {
    var on_show_styles = {maxHeight: "200px", transition: "max-height 450ms cubic-bezier(0.23, 1, 0.32, 1), margin 450ms cubic-bezier(0.23, 1, 0.32, 1)", overflow: "hidden", margin: "16px", padding: "0px"};
    var on_hide_styles = {maxHeight: "0px", transition: "max-height 450ms cubic-bezier(0.23, 1, 0.32, 1), margin 450ms cubic-bezier(0.23, 1, 0.32, 1)", overflow: "hidden", padding: "0px"};

    return(
      <Card className="card">
        <div className="prayer-info">
          <h2>{this.props.content}</h2>
          <h3>Submitted: {this.returnFormatedDate(this.props.date)}</h3>
        </div>
        <div>
          <p>Prayed for: {this.state.prayedForNumber} times</p>
          <Button onTouchTap={this.handleClick}>Prayed for</Button>
          {this.props.updateContent ? <Button onClick={this.handleExpand} style={{marginLeft: "10px"}}>See Update</Button> : null}
        </div>
        {this.props.updateContent ? <CardContent style={this.state.expanded ? on_show_styles : on_hide_styles}>
          {this.props.updateContent}
        </CardContent>
        : null}
      </Card>
    );
  }
});


module.exports = PrayerCard;