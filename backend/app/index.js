'use strict';
module.exports = function(db, app, router) {
    require('./_common')(app, db);
    require('./user')(db, app, router);
    require('./place')(db, app, router);

}