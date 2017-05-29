import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import PrayerCard from './PrayerCard.jsx'

var prayerService = require('../api/prayerService');

const Prayers = React.createClass({
  getInitialState: function(){
    return {
      prayers: [],
      error: false
    }
  },

  componentDidMount: function(){
    var that = this;

    prayerService.getAllPrayers().then(function(data){
      that.setState({
        prayers: data
      });
    }, function(err){
      that.setState({
        prayers: undefined,
        error: err
      });
    });
  },

  render: function(){

    var {prayers, error} = this.state;

    function renderError() {
      if(error){
        return <h3>{error}</h3>
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