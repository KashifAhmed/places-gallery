'use strict';
var path = require('path');

module.exports = function(app, scope) {


    // Create item Controller
    scope.controllers._createItem = function(req, res) {
        var _requestData = req.body,
            requireDate = ['locationName', 'description', 'zipCode', 'province', 'country', 'city', 'address', 'latLng'],
            responseFileds = ['_id', 'locationName', 'description', 'zipCode', 'province', 'country', 'city', 'address', 'geometry'];

        app.services._checkRequire(_requestData, requireDate, function(error) {
            if (error == false) {
                app.services._checkExist({
                    locationName: _requestData.locationName
                }, scope.collectionName, function(error_checkExist, isExist) {
                    if (error_checkExist == null) {
                        if (!isExist) {
                            _requestData.created_by = req.user._id;
                            var __geometry = JSON.parse(_requestData.latLng);
                            _requestData.geometry = {
                                type: 'Point',
                                coordinates: [__geometry.lat, __geometry.lng]
                            }
                            if (req.files && req.files.placeImage) {
                                var placeImage = req.files.placeImage;
                                console.log(req.files.placeImage);
                                var fileName = new Date();
                                var fname = fileName.getTime() + '.jpg';
                                var Url = path.resolve(__dirname, '../../public/uploads/' + fname);
                                placeImage.mv(Url, function(err) {
                                    if (err) {
                                        return res.status(500).send(err);
                                    } else {
                                        _requestData.image = fname;
                                        app.services._createItem(_requestData, scope.collectionName, function(error_createItem, success_createItem) {
                                            if (error_createItem == null) {
                                                res.status(200).send({
                                                    code: 200,
                                                    success: true,
                                                    message: 'Successfully Create Item',
                                                    data: app.services._successResponse(success_createItem, responseFileds)
                                                });
                                            } else {
                                                res.status(503).send({
                                                    code: 503,
                                                    success: false,
                                                    error: error_createItem,
                                                    message: "Error On Create Item"
                                                });
                                            }
                                        });
                                    }
                                });
                            } else {
                                app.services._createItem(_requestData, scope.collectionName, function(error_createItem, success_createItem) {
                                    if (error_createItem == null) {
                                        res.status(200).send({
                                            code: 200,
                                            success: true,
                                            message: 'Successfully Create Item',
                                            data: app.services._successResponse(success_createItem, responseFileds)
                                        });
                                    } else {
                                        res.status(503).send({
                                            code: 503,
                                            success: false,
                                            error: error_createItem,
                                            message: "Error On Create Item"
                                        });
                                    }
                                });
                            }

                        } else {
                            res.status(409).send({
                                code: 409,
                                success: false,
                                message: "Duplicate title required Unique"
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
    }

    // Search item controller
    scope.controllers._searchItems = function(req, res) {
        var _requestingQuery = req.query,
            _responseFields = '_id locationName country city description favorite created_by image',
            allowFields = {
                latlng: 'string',
                radius: 'number',
                city: 'string',
                country: 'string',
                locationName: 'string'
            },
            user = req.user;

        var _query = app.services._onlyAllow(allowFields, _requestingQuery);

        // setup query for geolocation radius base search
        if (_query.latlng) {
            var __radius = _query.radius || 5;
            _query.geometry = {
                $geoWithin: { $centerSphere: [JSON.parse(_query.latlng), milesToRadian(__radius)] }
            };
            delete _query.latlng;
            delete _query.radius;
        }
        scope.services._searchItem(_query, _responseFields, function(error, items) {
            if (error == null) {
                var __items = [];
                if (items.rows.length > 0) {
                    items.rows.forEach(function(item) {
                        if (item.favorite.length > 0 && item.favorite.indexOf(user.id) > -1) {
                            item._doc.isFavorite = true;
                        } else {
                            item._doc.isFavorite = false;
                        }
                        item._doc.can_edit = item.created_by == user.id ? true : false;
                        delete item._doc.created_by;
                        delete item._doc.favorite;
                        __items.push(item._doc);
                    });
                    items.rows = __items;
                }
                res.status(200).send({
                    code: 200,
                    success: true,
                    message: "Successfully Retrieve Items",
                    data: items
                });
            } else {
                res.status(504).send({
                    code: 504,
                    succes: false,
                    message: "Error On Retrieving Items",
                    error: error
                });
            }
        });
    }

    // Update Item controller
    scope.controllers._updateItem = function(req, res) {
        if (req.params.id) {
            var updateObject = req.body,
                responseFileds = ['_id', 'locationName', 'description', 'zipCode', 'province', 'country', 'city', 'address', 'geometry'],
                allowFields = {
                    locationName: 'string',
                    description: 'string',
                    zipCode: 'number',
                    province: 'string',
                    country: 'string',
                    city: 'string',
                    address: 'string',
                    latLng: 'object'
                }
                //delete updateObject._id;
            var requestData = app.services._onlyAllow(allowFields, updateObject);
            // Check item already exist
            var _checkExistQuery = {
                _id: { '$ne': req.params.id },
                locationName: requestData.locationName
            };
            app.services._checkExist(_checkExistQuery, scope.collectionName, function(error_checkExist, isExist) {
                if (error_checkExist == null) {
                    if (!isExist) {
                        // If item not exist then update
                        app.services._findAndUpdate({ _id: req.params.id }, requestData, scope.collectionName, function(error_update, succes_update) {
                            if (error_update == null) {
                                res.status(200).send({
                                    code: 200,
                                    succes: true,
                                    message: "Succssfully update item",
                                    data: app.services._successResponse(succes_update, responseFileds)
                                });
                            } else {
                                res.status(503).send({
                                    code: 503,
                                    succes: false,
                                    message: "Unable to update item",
                                    error: error_update
                                });
                            }
                        });
                    } else {
                        res.status(409).send({
                            code: 409,
                            succes: false,
                            message: "Duplicate Not Allowed",
                        });
                    }
                } else {
                    res.status(503).send({
                        code: 503,
                        succes: false,
                        message: "Unable to update item",
                        error: error_update
                    });
                }
            });

        } else {
            res.status(404).send({
                code: 404,
                succes: false,
                message: "Invalid Item ID",
            });
        }
    }


    // Remove item controller
    scope.controllers._deleteItem = function(req, res) {
        if (req.params.id) {
            app.services._findAndUpdate({
                _id: req.params.id,

            }, { isDeleted: true }, scope.collectionName, function(error_findAndUpdate, succes_findAndUpdate) {
                if (error_findAndUpdate == null) {
                    res.status(200)
                        .send({
                            code: 200,
                            succes: true,
                            message: "Successfully Delete item",
                        });
                }
            });
        }
    }

    // Item Details
    scope.controllers._itemDetails = function(req, res) {
        var _requestData = req.params,
            requireDate = ["id"];

        app.services._checkRequire(_requestData, requireDate, function(error) {
            if (error == false) {
                var _responseFields = 'locationName description zipCode province country city address geometry favorite image created_by';
                app.services.findOne({ _id: _requestData.id }, _responseFields, scope.collectionName, function(error, docs) {
                    if (error) {
                        res.status(503).send({
                            code: 503,
                            success: false,
                            message: "Successfully Retrieve Items",
                            error: error
                        });
                    } else {
                        res.status(200).send({
                            code: 200,
                            success: true,
                            message: "Successfully Retrieve Items",
                            data: docs
                        });
                    }
                });
            } else {
                res.status(error.code).send(error);
            }
        });
    }

    // Mark item in favorite
    scope.controllers._markFavoriteItem = function(req, res) {
        var _requestData = req.params,
            requireDate = ['id'],
            responseFileds = ['_id', 'locationName'],
            user = req.user;

        app.services._checkRequire(_requestData, requireDate, function(error) {
            if (error == false) {
                app.services._checkExist({ _id: _requestData.id, favorite: { $elemMatch: { "$in": [user.id] } } }, 'Place', function(error_checkExist, isExist) {
                    if (error_checkExist == null) {
                        if (!isExist) {
                            var _query = { favorite: user.id };
                            app.services._findAndPush({ _id: _requestData.id }, _query, 'Place', function(error_update, succes_update) {
                                if (error_update == null) {
                                    res.status(200).send({
                                        code: 200,
                                        succes: true,
                                        message: "Succssfully add item",
                                        data: app.services._successResponse(succes_update, responseFileds)
                                    });
                                } else {
                                    res.status(503).send({
                                        code: 503,
                                        succes: false,
                                        message: "Unable to update item",
                                        error: error_update
                                    });
                                }
                            });
                        } else {
                            var _query = { favorite: [user.id] };
                            app.services._findAndPull({ _id: _requestData.id }, _query, 'Place', function(error_update, succes_update) {
                                if (error_update == null) {
                                    res.status(200).send({
                                        code: 200,
                                        succes: true,
                                        message: "Succssfully remove item",
                                        data: app.services._successResponse(succes_update, responseFileds)
                                    });
                                } else {
                                    res.status(503).send({
                                        code: 503,
                                        succes: false,
                                        message: "Unable to update item",
                                        error: error_update
                                    });
                                }
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
    }

    // Get all my favorite Item
    scope.controllers._getFavoriteItem = function(req, res) {
        var _responseFields = '_id locationName',
            user = req.user,
            _query = { favorite: { $elemMatch: { "$in": [user.id] } } }
        scope.services._searchItem(_query, _responseFields, function(error, items) {
            if (error == null) {
                res.status(200).send({
                    code: 200,
                    success: true,
                    message: "Successfully Retrieve Items",
                    data: items
                });
            } else {
                res.status(504).send({
                    code: 504,
                    succes: false,
                    message: "Error On Retrieving Items",
                    error: error
                });
            }
        });
    }

    // Support Method
    var milesToRadian = function(miles) {
        var earthRadiusInMiles = 3959;
        return miles / earthRadiusInMiles;
    };

};