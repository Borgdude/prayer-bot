import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Card from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import { Row, Col } from 'react-flexbox-grid';
var memberService = require('../api/memberService');

const PrayedForPage = React.createClass({
    getInitialState: function(){
      return {
          prayersSubmitted: [],
          prayersPrayedFor: [],
          err: null,
          index: 0
      }
    },

    componentDidMount: function(){
      var that = this;
      memberService.getPrayersSubmitted().then(function(data){
        console.log(data);
        that.setState({
          prayersSubmitted: data.prayerItems
        });
      }, function(err){
        console.log(err);
        that.setState({
          err: err
        });
      });
      memberService.getPrayedFor().then(function(data){
        that.setState({
          prayersPrayedFor: data
        }); 
      }, function(err){
        console.log(err);
        that.setState({
          err: err
        });
      });
    },

    handleChange: function(event, index){
      this.setState({ index });
    },

    render: function() {
      var { err, prayersPrayedFor, prayersSubmitted } = this.state;
      return (
          <div> 
            <Row center="xs">
              <Col xs={12} md={10} lg={8}>
              <h1>Prayers and stuff</h1>
              </Col>
            </Row>
            <Row center="xs">
              <Col xs={12} md={10} lg={8}>
              <AppBar color="default" position="static">
                  <Tabs 
                    index={this.state.index}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    fullWidth
                    centered
                  >
                    <Tab label="Prayers prayed for" />
                    <Tab label="Prayers Submited" />
                  </Tabs>
                </AppBar>
                {this.state.index === 0 && 
                prayersPrayedFor.map((prayerItem, idx) => (
                  <Card key={idx} className="prayedfor-card">
                    <h2>{prayerItem.content}</h2>
                    <h3>Prayed for: {prayerItem.prayedForNumber} times</h3>
                  </Card>
                ))}
                {this.state.index === 1 && 
                prayersSubmitted.map((item, idx) => (
                  <Card key={idx} className="prayedfor-card">
                    <h2>{item.content}</h2>
                    <h3>Prayed for: {item.prayedForNumber} times</h3>
                  </Card>
                ))}
              </Col>
            </Row>
          </div>
      );
    }
});

PrayedForPage.contextTypes = {
  router: PropTypes.object.isRequired
};

module.exports = PrayedForPage;
