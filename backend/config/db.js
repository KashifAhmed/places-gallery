'use strict';

module.exports = function(db) {
    db.connect("mongodb://admin:admin@ds149353.mlab.com:49353/place-gallery");


    db.connection.on('connected', function() {
        console.log('Mongoose default connection open to ');
    });

    // If the connection throws an error
    db.connection.on('error', function(err) {
        console.log('Mongoose default connection error: ' + err);
    });

    // When the connection is disconnected
    db.connection.on('disconnected', function() {
        console.log('Mongoose default connection disconnected');
    });
};