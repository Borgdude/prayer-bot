import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import PrayerCard from './PrayerCard.jsx';
import LoginDialog from './Dialog';
// import MasonryInfiniteScroller from 'react-masonry-infinite';
import { CircularProgress } from 'material-ui/Progress';
import MasonryLayout from 'react-masonry-layout'
// import Pagination from 'material-ui-pagination';

var prayerService = require('../api/prayerService');

const NoMore = React.createClass({
  render: function(){
    return(
      <div style={{textAlign: 'center'}}>
        <h1>No more prayers left</h1>
      </div>
    );
  }
})

const Prayers = React.createClass({
  getInitialState: function(){
    return {
      prayers: [],
      error: false,
      noPrayers: false,
      open: false,
      offset: 0,
      perPage: 8,
      noMore: false,
      isLoading: false
    }
  },

  loadPrayers: function(){
    var that = this;

    prayerService.getAllPrayers(that.state.perPage, that.state.offset).then(function(data){
      if(data.count === 0){
        that.setState({ noPrayers: true, prayers: [], isLoading: false});
      } else if(data.rows.length === 0){
        that.setState({noMore: true, isLoading: false});
        console.log('no more');
      } else {
        console.log(data.rows.length);
        that.setState({count: data.count, prayers: that.state.prayers.concat(data.rows), offset: (that.state.offset += data.rows.length), isLoading: false});
      }
    }, function(err){
      that.setState({prayers: [], error: err, isLoading: false});
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

  handleLoadMore: function(){
    this.setState({isLoading: true});
    this.loadPrayers();
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

    var prayerElements = prayers.map((item, idx) => (
        <PrayerCard key={item.id} prayerID={item.id} content={item.content} date={item.createdAt} prayedForNumber={item.prayedForNumber} updateContent={item.updateContent} onOpen={this.handleOpen} />
    ));

    return(
      <div>
        <Row center="xs">
          <Col xs={7}>
            <h1 className="header">Prayer Requests</h1>
          </Col>
        </Row>
        {renderError()}
        {renderMessage()}
        <MasonryLayout
          id="masonry"
          sizes={[{ columns: 1, gutter: 20 }, { mq: '600px', columns: 2, gutter: 20 }, { mq: '950px', columns: 3, gutter: 20 }, { mq: '1120px', columns: 4, gutter: 20 }]}
          infiniteScrollEnd={this.state.noMore}
          className="masonry"
          infiniteScroll={this.handleLoadMore}
          infiniteScrollLoading={this.state.isLoading}
          infiniteScrollSpinner={<CircularProgress style={{textAlign: 'center'}}/>}
          infiniteScrollEndIndicator={<NoMore />}>
          {prayerElements}
        </MasonryLayout>
        {/*<Pagination 
          total={this.state.pageCount}
          current={this.state.number}
          display={5}
          onChange={this.handlePageClick}
        />*/}
        <LoginDialog open={this.state.open} onClose={this.handleClose} />
      </div>
    )
  }
});

module.exports = Prayers;