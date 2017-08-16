'use strict';

module.exports = function(app,router, scope){


  router.route('/category/:id?')
    .post(app.services._authorization, app.services._hasAdminAccess, scope.controllers._createItem)
    .get(app.services._authorization, scope.controllers._searchItems)
    .put(app.services._authorization, scope.controllers._updateItem)
    .delete(app.services._authorization, scope.controllers._deleteItem);

  

};