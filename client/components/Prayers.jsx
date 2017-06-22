import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import PrayerCard from './PrayerCard.jsx'

var prayerService = require('../api/prayerService');

const Prayers = React.createClass({
  getInitialState: function(){
    return {
      prayers: [],
      error: false,
      noPrayers: false
    }
  },

  componentDidMount: function(){
    var that = this;

    prayerService.getAllPrayers().then(function(data){
      console.log(data);
      if(data.length === 0){
        that.setState({ noPrayers: true, prayers: []});
      } else {
        that.setState({
          prayers: data
        });
      }
    }, function(err){
      that.setState({
        prayers: [],
        error: err
      });
    });
  },

  render: function(){

    var {prayers, error, noPrayers} = this.state;

    function renderError() {
      if(error){
        return <h3>{error}</h3>
      }
    }

    function renderMessage() {
      if(noPrayers){
        return <h3 className="allPrayedFor-message">No prayers available</h3>
      }
    }

    return(
      <div>
        <Row center="xs">
          <Col xs={12}>
            <h1 className="header">Prayer Requests</h1>
          </Col>
        </Row>
        <Row center="xs">
            {renderError()}
            {renderMessage()}
            {
              prayers.map((item, idx) => (
                <Col key={idx} xs={12} sm={6} md={4} lg={3} >
                  <PrayerCard prayerID={item.id} content={item.content} date={item.createdAt} prayedForNumber={item.prayedForNumber}/>
                </Col>
              ))
            }
        </Row>
      </div>
    )
  }
});

module.exports = Prayers;