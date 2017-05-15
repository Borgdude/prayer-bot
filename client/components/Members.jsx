import React from 'react';
import { Table, TableHead, TableRow, TableCell, Panel } from 'react-toolbox';
import { Row, Col } from 'react-flexbox-grid';

var memberService = require('../api/memberService');

const Members = React.createClass({
  getInitialState: function(){
    return {
      source: []
    }
  },

  componentDidMount: function(){
    var that = this;
    memberService.getAllMembers().then(function(data){
      that.setState({
        source: data
      });
    }, function(e){
        console.log(e);
    });
  },

  handleSelect: function(selected){
    alert(selected);
  },

  returnFormatedDate: function(string){
    var d = new Date(string);
    return d.toDateString();
  },

  render: function() {
    return(
      <div>
        <Row center="xs">
          <Col xs={12} sm={10} md={8} lg={8}>
            <h1 className="header">Prayer Requests</h1>
          </Col>
        </Row>
        <Row center="xs">
          <Col xs={12} sm={10} md={8} lg={8}>
              <Table selectable={false}>
                <TableHead displaySelect={false}>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Prayer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Prayed For</TableCell>
                </TableHead>
              {this.state.source.map((item) => (
                item.prayerItems.map((prayerItem, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.phoneNumber}</TableCell>
                    <TableCell>{prayerItem.content}</TableCell>
                    <TableCell>{this.returnFormatedDate(prayerItem.createdAt)}</TableCell>
                    <TableCell>{prayerItem.complete.toString()}</TableCell>
                  </TableRow>
                ))
              ))}
              </Table>
          </Col>
        </Row>
      </div>
    );
  }
});

module.exports = Members;
