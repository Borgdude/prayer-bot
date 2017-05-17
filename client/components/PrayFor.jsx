import React from 'react';
import { Row, Col } from 'react-flexbox-grid';

import PrayerCard from './PrayerCard.jsx'

var prayerService = require('../api/prayerService');

const PrayFor = React.createClass({

  getInitialState: function(){
    return {
      content: "ayy lmao",
      date: "ayy lmao",
      allPrayedFor: false
    }
  },

  componentDidMount: function(){


    this.setState({
        content: undefined,
        date: undefined,
        prayerID: undefined
    });

    this.getUnprayedFor();
  },

  getUnprayedFor: function(){
    var that = this;

    prayerService.getUnprayedFor().then(function(data){
        console.log(data);
        if(data.AllPrayedFor === true){
          that.setState({
            allPrayedFor: true,
            content: false
          });
        } else {
          that.setState({
              content: data.content,
              date: data.createdAt,
              prayerID: data.id
          });
        }
        console.log("data" + data);
    }, function(e){
        console.log(e);
    });
  },

  handlePrayer: function(){
    console.log("Handled prayer called!");
    var that = this;

    prayerService.updateOnePrayer(that.state.prayerID).then(function(data){
      that.getUnprayedFor();
    }, function(e){
      console.log(e);
    });
  },

  render: function() {

    var {content, date, allPrayedFor} = this.state;
    var that = this;

    function renderCard(){
      if(content, date){
        return <PrayerCard prayedFor={() => that.handlePrayer()} content={content} date={date} />
      }
    }

    function renderMessage(){
      if(allPrayedFor === true){
        return <h3 className="allPrayedFor-message">All prayers have been completed!</h3>
      }
    }

    return(
      <div>
        <Row center="xs">
          <Col xs={12} sm={10} md={8} lg={8}>
            <h1>Pray For Prayer Requests</h1>
          </Col>
        </Row>
        <Row center="xs">
            {renderMessage()}
            {renderCard()}
        </Row>
      </div>
    );
  }
});

module.exports = PrayFor;
