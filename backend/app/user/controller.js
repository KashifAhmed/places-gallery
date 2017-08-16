'use strict';
module.exports = function(app) {

    // ==================================
    // Login User
    app.controllers._doSignIn = function(req, res) {
        var _requestData = req.body;
        if (_requestData.role == 'user') {
            var requireDate = ['email', 'password', 'role'], // All the requie fields will here
                responseFields = ['first_name', 'last_name', 'access_token', 'email']; // One these fields will show in response
        } else if (_requestData.role == 'admin') {
            var requireDate = ['email', 'password', 'role'], // All the requie fields will here
                responseFields = ['first_name', 'last_name', 'access_token', 'email']; // One these fields will show in response
        }

        app.services._checkRequire(_requestData, requireDate, function(error) {
            if (error == false) {
                var _query = { email: _requestData.email, password: _requestData.password };
                app.services.authenticate_customer(_query, function(error_authenticate, success_authenticate) {
                    console.log('app.services.authenticate_customer', error_authenticate, success_authenticate);
                    if (error_authenticate == null) {
                        if (success_authenticate != null) {
                            res.status(200).send({
                                code: 200,
                                success: true,
                                data: app.services._successResponse(success_authenticate, responseFields),
                                message: "Successfully Login"
                            });
                        }
                        res.send({
                            code: 404,
                            success: false,
                            message: "Email & password invalid"
                        })
                    } else {
                        res.send(app.services._errorResponse(error_authenticate));
                    }
                });
            } else {
                res.status(error.code).send(error);
            }
        })


    }

    // ================================================
    // Create New User
    app.controllers._doRegiser = function(req, res) {
        var _requestData = req.body,
            requireDate = ['email', 'password', 'first_name', 'last_name'], // All the requie fields will here
            responseFields = ['first_name', 'last_name', 'access_token', 'email']; // One these fields will show in response

        app.services._checkRequire(_requestData, requireDate, function(error) {
            if (error == false) {
                app.services._checkExist({ email: _requestData.email }, 'User', function(error_checkExist, isExist) {

                    if (error_checkExist == null) {
                        if (!isExist) {
                            app.services.createUser(_requestData, function(error_createUser, success_createUser) {
                                if (error_createUser == null) {
                                    if (success_createUser._id) {
                                        res.status(200).send({
                                            code: 200,
                                            success: true,
                                            message: 'Successfully Create User',
                                            data: app.services._successResponse(success_createUser, responseFields)
                                        });
                                    } else {
                                        res.send(app.services._errorResponse(error_createUser));
                                    }
                                } else {
                                    res.status(403).send({
                                        code: 403,
                                        success: false,
                                        message: "Unable to Register new User",
                                        error: error_createUser
                                    });
                                }
                            });
                        } else {
                            res.status(409).send({
                                code: 409,
                                success: false,
                                message: "Duplicate email required Unique"
                            });
                        }
                    } else {
                        res.status(503).send({
                            code: 503,
                            success: false,
                            message: "Forbidden"
                        });
                    }
                });
            } else {
                res.status(error.code).send(error);
            }
        });
        // End
        // ================================================


    }

    // ================================================
    // Get All shopkeepers
    app.controllers._getUsers = function(req, res) {
        var _requestData = req.query || '';
        app.services.getUsers(_requestData, function(error_getUsers, success_getUsers) {
            if (error_getUsers == null) {
                res.status(200).send({
                    status: 200,
                    success: true,
                    data: success_getUsers.rows,
                    page: success_getUsers.page,
                    totalPages: success_getUsers.totalPages,
                    limit: success_getUsers.limit,
                    count: success_getUsers.count,
                    message: "Successfully fetch results"
                });
            } else {
                res.send(error_getUsers);
            }
        });
    }

};