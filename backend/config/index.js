
(function(){
    'use strict';
    module.exports=function(db,app){
        app.controllers = {};
        app.services = {};

        require('./db')(db);
        require('./logs')(app.service);
        console.log("Config Loaded");
        
    }
})();