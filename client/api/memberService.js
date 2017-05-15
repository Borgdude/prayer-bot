var axios = require('axios');

module.exports = {
  getAllMembers: function () {
    return axios.get('/members').then(function(res){
      return res.data;
    }, function(res){
      throw new Error("No members found or something");
    })
  }
}
