'use strict';
module.exports = function (app, scope) {


  // Create item Controller
  scope.controllers._createItem = function (req, res) {
    var _requestData = req.body,
      requireDate = ['title'],
      responseFileds = ['title', '_id'];

    app.services._checkRequire(_requestData, requireDate, function (error) {
      if (error == false) {
        app.services._checkExist({ title: _requestData.title }, scope.collectionName, function (error_checkExist, isExist) {
          if (error_checkExist == null) {
            if (!isExist) {
              _requestData.created_by = req.user._id;
              app.services._createItem(_requestData, scope.collectionName, function (error_createItem, success_createItem) {
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
  scope.controllers._searchItems = function (req, res) {
    var _requestingQuery = req.query;
    // need to add validation in query if data is not acceptable send an error invalid data;
    scope.services._searchItem(_requestingQuery, 'title _id', function (error, categories) {
      if (error == null) {
        res.status(200).send({
          code: 200,
          success: true,
          message: "Successfully Retrieve Items",
          data: categories
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
  scope.controllers._updateItem = function (req, res) {
    if (req.params.id) {
      // need to add validation in body if data is not acceptable send an error invalid data and also check special characters in string;
      var updateObject = req.body, responseFileds = ['title', '_id'], allowFields = {
        title: 'string'
      }
      //delete updateObject._id;
      var requestData = app.services._onlyAllow(allowFields, updateObject);
      // Check item already exist
      app.services._checkExist({ title: requestData.title }, scope.collectionName, function (error_checkExist, isExist) {
        if (error_checkExist == null) {
          if (!isExist) {
            // If item not exist then update
            app.services._findAndUpdate({ _id: req.params.id }, requestData, scope.collectionName, function (error_update, succes_update) {
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
  scope.controllers._deleteItem = function (req, res) {
    if (req.params.id) {
      app.services._findAndUpdate({
        _id: req.params.id,

      }, { isDeleted: true }, scope.collectionName, function (error_findAndUpdate, succes_findAndUpdate) {
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

};
