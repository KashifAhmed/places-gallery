'use strict';

module.exports = function(app,router){


  router
    .route('/login')
    .post(app.controllers._doSignIn);

  router
    .route('/user')
    .post(app.controllers._doRegiser)
    .get(app.services._authorization, app.services._hasAdminAccess, app.controllers._getUsers);
  
};