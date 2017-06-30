import React from 'react';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';
import { Row, Col } from 'react-flexbox-grid';
import Button from 'material-ui/Button';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

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
        source: data.rows
      });
      console.log(data);
    }, function(e){
        console.log(e);
    });
  },

  handleDeleteClick: function(){
    var that = this;
    var prayerids = this.state.selected;
    // console.log(prayerids);
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

  handleSelectAllClick: function(event, checked){
    if (checked) {
      this.setState({ selected: this.state.source.map(n => n.id) });
      return;
    }
    this.setState({ selected: [] });
  },

  handleClick: function(event, id){
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
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
            <Button raised className="delete-button" onClick={this.handleDeleteClick} disabled={selected.length > 0 ? false : true}>Delete Selected</Button>  
          </Col>    
        </Row>
        <Row center="xs">
          <Col xs={12} md={10} lg={8}>
            <Paper style={{overflowX: 'auto', width: '100%'}}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell checkbox>
                      <Checkbox onChange={this.handleSelectAllClick} />
                    </TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>Prayer</TableCell>
                    <TableCell>Times prayed for</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Prayed For</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody >   
                {source.map((prayerItem, idx) => (
                  <TableRow hover key={idx} selected={selected.indexOf(prayerItem.id) !== -1}
                    onClick={event => this.handleClick(event, prayerItem.id)}>
                      <TableCell checkbox>
                        <Checkbox checked={selected.indexOf(prayerItem.id) !== -1} />
                      </TableCell>
                      <TableCell>{prayerItem.id}</TableCell>
                      <TableCell>{prayerItem.content}</TableCell>
                      <TableCell>{prayerItem.prayedForNumber}</TableCell>
                      <TableCell>{this.returnFormatedDate(prayerItem.createdAt)}</TableCell>
                      <TableCell>{prayerItem.complete.toString()}</TableCell>
                  </TableRow>
                ))}
                </TableBody>
              </Table>
            </Paper>
          </Col>
        </Row>
      </div>
    );
  }
});

module.exports = PrayerManager;
