import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import PrayerCard from './PrayerCard.jsx';
import LoginDialog from './Dialog';

var prayerService = require('../api/prayerService');

const Prayers = React.createClass({
  getInitialState: function(){
    return {
      prayers: [],
      error: false,
      noPrayers: false,
      open: false,
      offset: 0,
      perPage: 20,
      number: 1
    }
  },

  loadPrayers: function(){
    var that = this;

    prayerService.getAllPrayers(that.state.perPage, this.state.offset).then(function(data){
      console.log(data);
      if(data.count === 0){
        that.setState({ noPrayers: true, prayers: []});
      } else {
        that.setState({prayers: data.rows, pageCount: Math.ceil(data.count / that.state.perPage)});
      }
    }, function(err){
      that.setState({prayers: [], error: err});
    });
  },

  buildPrayers: function(){
    var prayers = []
  },

  componentDidMount: function(){
    this.loadPrayers();
  },

  handleClose: function(){
    console.log("CLOSE IT!");
    this.setState({ open: false });
  },

  handleOpen: function(){
    if(!localStorage.getItem('never_see')){
      this.setState({ open: true });
    }
  },

  handlePageClick: function(number){
    let offset = Math.ceil((number - 1) * this.state.perPage);
    this.setState({offset: offset, number: number}, () => {
      this.loadPrayers();
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
        <Row>
            {renderError()}
            {renderMessage()}
            {
              prayers.map((item, idx) => (
                <Col key={idx} xs={12} sm={6} md={4} lg={3} >
                  <PrayerCard prayerID={item.id} content={item.content} date={item.createdAt} prayedForNumber={item.prayedForNumber} updateContent={item.updateContent} onOpen={this.handleOpen} />
                </Col>
              ))
            }
        </Row>
        <LoginDialog open={this.state.open} onClose={this.handleClose} />
      </div>
    )
  }
});

module.exports = Prayers;