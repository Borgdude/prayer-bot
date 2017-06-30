var axios = require('axios');
import Auth from './Auth';

axios.defaults.headers.common['Authorization'] = `bearer ${Auth.getToken()}`;

module.exports = {
  getAllMembers: function () {
    return axios.get('/members').then(function(res){
      return res.data;
    }, function(res){
      throw new Error("No members found or something");
    })
  },
  getPrayedFor: function(){
    return axios.get('/api/prayedfor').then(function(res){
      // console.log(res.data);
      return res.data;
    }, function(err){
      console.log(err);
      throw new Error("Something messed up");
    });
  },
  getPrayersSubmitted: function(){
    return axios.get('/members/one').then(function(res){
      // console.log(res.data);
      return res.data;
    }, function(err){
      console.log(err);
      throw new Error("Something messed up");
    });
  }
}
