'use strict';
module.exports = function (app) {
  app.services.authenticate_customer = function (_query, cb) {
    if (_query.email && _query.password) {
      app.services._encryptPassword(_query.password, function (encrypt_error, encrypted_password) {
        if (encrypt_error) {
          cb(null, {
            code: 420,
            message: "_encryptPassword error"
          });
        } else {
          _query.password = encrypted_password;
          var uid = require('rand-token').uid;
          var new_access_token = uid(48);

          app.services._findAndUpdate(_query, { access_token: new_access_token }, 'User', function (error_findAndUpdate, success_findAndUpdate) {
            if (error_findAndUpdate == null) {
              cb(null, success_findAndUpdate);
            } else {
              cb(error_findAndUpdate, null);
            }
          });
        }
      });
    } else {
      cb({
        code: 404,
        message: "Email & Password require"
      }, null);
    }

  }

  app.services.createUser = function (userObject, cb) {
    console.log('==> Call', 'app.services.createUser');
    if (userObject) {
      app.services._encryptPassword(userObject.password, function (encrypt_error, encrypted_password) {
        if (encrypt_error) {
          cb({
            code: 420,
            message: "_encryptPassword error"
          }, null);
        } else {
          userObject.password = encrypted_password;
          app.services._createItem(userObject, 'User', function (error, docs) {
            if (!error) {
              cb(null, docs);
            } else {
              cb(error, null);
            }
          });
        }
      });
    }
  }

  app.services.getUsers = function (_query, cb) {
    if (_query) {
      //_query.start = _query.start || 1;
      //_query.limit = _query.limit || 10;
      //_query.role = ''
      var filterQuery = {};
      if (_query.role) {
        filterQuery.role = _query.role;
      }
      if (_query.first_name) {
        filterQuery.first_name = new RegExp(_query.first_name, "i");
      }
      if (_query.last_name) {
        filterQuery.last_name = new RegExp(_query.last_name, "i");
      }
      if (_query.limit) {
        filterQuery.limit = Number(_query.limit);
      }
      if (_query.page) {
        filterQuery.page = Number(_query.page) - 1;
      }
      app.services._filterItems(filterQuery, 'id first_name last_name', 'User', function (error_filterItems, success_filterItems) {
        if (error_filterItems == null) {
          cb(null, success_filterItems);
        } else {
          cb(error_filterItems, null);
        }
      });
    }
  }
};
