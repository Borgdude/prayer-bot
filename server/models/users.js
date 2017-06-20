const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  var Users = sequelize.define('Users', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {

    },
    instanceMethods:{
      comparePasswordsAndGenToken: function(password) {
        var userid = this.id;
        var username = this.username;
        var hashedpass = this.password;
        console.log(this);
        return new Promise(function(resolve, reject){
          console.log(hashedpass);
          console.log(password);
          bcrypt.compare(password, hashedpass, (err, same) => {
            if (err) reject(err);

            if(!same){
              const error = new Error('Incorrect email or password');
              error.name = 'IncorrectCredentialsError';

              reject(error);
            } else {
              
              const payload = {
                sub: userid
              };

              const token = jwt.sign(payload, process.env.SECRET);
              const data = {
                username: username
              };

              resolve(token, data);
            }
          });
        });
      }
    }
  });
  return Users;
};
