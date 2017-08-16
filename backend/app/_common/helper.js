'use strict';
module.exports = function (app, db) {
    const crypto = require("crypto");
    const ITERATIONS = 1000;
    const secureKey = "bspZmdcJJ5";
    const BYTES = 32;
    // ===================================
    // Check Require Fields
    app.services._checkRequire = function (data, req_fields, cb) {
        var non_existField = null;

        req_fields.forEach(function (value) {
            if (data[value] == '' || data[value] == null || !data[value]) {
                non_existField = value;
                return true;
            }
        });

        if(non_existField != null){
            cb({
                code: 400,
                success: false,
                message: "Endpoint Not Found",
                key: non_existField
            });
        }else{
            cb(false)
        }
        
    }
    // End
    // ===================================

    // ===================================
    // Success Response
    app.services._successResponse = function (data, req_fields) {
        console.log("\x1b[34m", "------------------------------------");
        console.log("\x1b[0m", "== > Method", "app.services._successResponse");
        console.log('== > DateTime', new Date());
        console.log("== > data", JSON.stringify(data));
        console.log("\x1b[34m", "------------------------------------\n \n");
        console.log("\x1b[0m")
        var _responseData = {};
        if (data) {
            req_fields.forEach(function (value) {
                if (data[value]) {
                    _responseData[value] = data[value];
                }
            });
        }

        return (_responseData);
    }
    // End
    // ===================================

    // ===================================
    // Error Response
    app.services._errorResponse = function (error) {
        console.log("\x1b[34m", "------------------------------------");
        console.log("== > Method", "app.services._errorResponse");
        console.log('== > DateTime', new Date());
        console.log("== > error", JSON.stringify(error));
        console.log("\x1b[34m", "------------------------------------\n \n");
        console.log("\x1b[0m")
        if (error.code == 11000) {
            return ({
                code: 409,
                success: false,
                message: error.message
            });
        } else {
            return ({
                code: 409,
                success: false,
                message: 'Duplicate entity require unique'
            })
        }
    }
    // End
    // ===================================


    // ===================================
    // Check Exist Item
    app.services._encryptPassword = function (password, callBack) {
        console.log("\x1b[34m", "------------------------------------");
        console.log("== > Method", "app.services._encryptPassword");
        console.log('== > DateTime', new Date());
        console.log("== > data", password);
        console.log("\x1b[34m", "------------------------------------\n \n");
        console.log("\x1b[0m");
        crypto.pbkdf2(password, secureKey, ITERATIONS, BYTES, 'sha1', function (err, derivedKey) {
            if (err) {
                callBack(err);
            } else {
                var hexEncodedKey = new Buffer(derivedKey).toString('hex');
                callBack(null, hexEncodedKey);
            }
        });
    }
    // End
    // ===================================

    // ===================================
    // Only allow specific fileds
    app.services._onlyAllow = function(_data_sample, _data){
        var allowData = {};
        for(var key in _data_sample){
            if(typeof _data[key] == _data_sample[key]){
                allowData[key] = _data[key];
            }
        }
        
        return allowData;
    }
}
