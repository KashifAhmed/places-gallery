'use strict';

module.exports = function(app, router, scope) {
    router.route('/place/:id?')
        .post(app.services._authorization, scope.controllers._createItem)
        .get(app.services._authorization, scope.controllers._searchItems)
        .put(app.services._authorization, scope.controllers._updateItem)
        .delete(app.services._authorization, scope.controllers._deleteItem);
};