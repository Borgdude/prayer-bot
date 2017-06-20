var axios = require('axios');
import Auth from './Auth';

axios.defaults.headers.common['Authorization'] = `bearer ${Auth.getToken()}`;

module.exports = {
  getUnprayedFor: function(){
    return axios.get('/prayers/oneUnprayed').then(function(res){
      if(res.status === 204){
        return {"AllPrayedFor": true};
      } else {
        return res.data;
      }
    }, function(res){
      console.log("error");
      throw new Error("No prayer found or something");
    })
  },
  updateOnePrayer: function(prayerID) {
    return axios.put("/prayers/" + prayerID).then(function(res){
      return res.data;
    }, function(err){
      console.log(err);
      throw new Error("Prayer did not update succesffuly");
    });
  },
  getAllPrayers: function(){
    return axios.get('prayers/all').then(function(res){
      return res.data;
    }, function(err){
      console.log(err);
      throw new Error("Error when getting all prayers.")
    });
  },
  incrementOnePrayer: function(prayerid){
    return axios.put("/prayers/increment/" + prayerid).then(function(res){
      return res.data;
    }, function(err){
      console.log(err);
      throw new Error("Prayer did not update succesffuly");
    });
  }
}
