'use strict';
module.exports = function (app, scope) {
  // Here you can write your services.
  // For keep controller clean.

  
  scope.services._searchItem = function (_query, _requesting_fields, cb) {
    if (_query && cb && typeof cb == 'function') {
      if (_query.title && _query.title.length>0) {
        _query.title = new RegExp(_query.title, "i");
      }
      _query.is_deleted = false;
      app.services._filterItems(_query, _requesting_fields, scope.collectionName, function (error_filterItems, success_filterItems) {
        if (error_filterItems == null) {
          cb(null, success_filterItems);
        } else {
          cb(error_filterItems, null);
        }
      })
    } else {
      cb("Method Error", null)
    }
  }


};
