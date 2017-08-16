
'use strict';
module.exports = function (app, db) {
    require('./helper')(app, db);
    require('./_middle_wares')(app);
    require('./_db_queries')(app, db);
}
