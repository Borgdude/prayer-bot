var axios = require('axios');

module.exports = {
  getUnprayedFor: function(){
    return axios.get('/prayers/oneUnprayed').then(function(res){
      console.log(res.data);
      return res.data;
    }, function(res){
      console.log("error");
      throw new Error("No prayer found or something");
    })
  }
}
