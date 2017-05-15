import React from 'react';
import { Row, Col } from 'react-flexbox-grid';

import PrayerCard from './PrayerCard.jsx'

var prayerService = require('../api/prayerService');

const PrayFor = React.createClass({

  getInitialState: function(){
    return {
      content: "ayy lmao",
      date: "ayy lmao"
    }
  },

  componentDidMount: function(){
    var that = this;

    this.setState({
        content: undefined,
        date: undefined,
        prayerID: undefined
    });

    prayerService.getUnprayedFor().then(function(data){
        that.setState({
            content: data.content,
            date: data.createdAt,
            prayerID: data.id
        });
        console.log("data" + data);
    }, function(e){
        console.log(e);
    });
  },

  handlePrayer: function(){

  },

  render: function() {

    var {content, date} = this.state;

    function renderCard(){
      if(content, date){
        return <PrayerCard prayedFor={this.handlePrayer} content={content} date={date} />
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
            {renderCard()}
        </Row>
      </div>
    );
  }
});

module.exports = PrayFor;
