import React from 'react';
import { Table, TableHead, TableRow, TableCell} from 'react-toolbox/lib/table';
import { Row, Col } from 'react-flexbox-grid';
import {Button, IconButton} from 'react-toolbox/lib/button';

var prayerService = require('../api/prayerService');

const PrayerManager = React.createClass({
  getInitialState: function(){
    return {
      source: [],
      selected: [],
      error: false
    }
  },

  componentDidMount: function(){
    var that = this;
    prayerService.getAllPrayers().then(function(data){
      that.setState({
        source: data
      });
      console.log(data);
    }, function(e){
        console.log(e);
    });
  },

  handleDeleteClick: function(){
    var that = this;
    var prayerids = this.state.selected;
    //alert(prayerids.toString());
    prayerService.deletePrayers(prayerids).then(function(data){
      that.setState({
        source: data,
        selected: []
      });
    }, function(err){
      that.setState({
        error: err.toString()
      });
    });
  },

  /**
   * Process the form.
   *
   * @param {String} Date String - the JavaScript event object
   */
  returnFormatedDate: function(string){
    var d = new Date(string);
    return d.toDateString();
  },

  handleRowSelect: function(selecteroni){
    var data = this.state.source;

    this.setState({
      selected: selecteroni.map(item => data[item].id)
    });
  },

  render: function() {

    var { error, selected, source } = this.state;

    function renderError() {
      if(error){
        return <h3>{error}</h3>
      }
    }

    return(
      <div>
        <Row center="xs">
          <Col xs={12} sm={10} md={8} lg={8}>
            <h1 className="header">Manage Prayer Requests</h1>
            {renderError()}
          </Col>
        </Row>
        <Row className="edit-row" center="xs">
          <Col xs={12} sm={10} md={8} lg={8}>
            <Button className="delete-button" onClick={this.handleDeleteClick} label="Delete Selected" raised disabled={selected.length > 0 ? false : true}/>  
          </Col>    
        </Row>
        <Row center="xs">
          <Col xs={10} sm={10} md={8} lg={8}>
              <Table multiSelectable onRowSelect={this.handleRowSelect}>
                <TableHead >
                  <TableCell>id</TableCell>
                  <TableCell>Prayer</TableCell>
                  <TableCell>Number of times prayed for</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Prayed For</TableCell>
                </TableHead>
              {source.map((prayerItem, idx) => (
                  <TableRow key={idx} selected={selected.indexOf(prayerItem.id) !== -1}>
                    <TableCell>{prayerItem.id}</TableCell>
                    <TableCell>{prayerItem.content}</TableCell>
                    <TableCell>{prayerItem.prayedForNumber}</TableCell>
                    <TableCell>{this.returnFormatedDate(prayerItem.createdAt)}</TableCell>
                    <TableCell>{prayerItem.complete.toString()}</TableCell>
                  </TableRow>
              ))}
              </Table>
          </Col>
        </Row>
      </div>
    );
  }
});

module.exports = PrayerManager;
