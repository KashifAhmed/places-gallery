'use strict';
module.exports = function (app, db) {



    // ===================================
    // Create New Item
    app.services._createItem = function (data, collection_name, cb) {
        console.log("\x1b[34m", "------------------------------------");
        console.log("== > Method", "app.services._createItem");
        console.log('== > DateTime', new Date());
        console.log("== > data", JSON.stringify(data));
        console.log("== > collection_name", collection_name);
        console.log("\x1b[34m", "------------------------------------\n \n");
        console.log("\x1b[0m")
        if (data && collection_name) {
            if (db[collection_name]) {
                var COLLECTION = db[collection_name],
                    item = new COLLECTION(data);
                item.save(function (error, docs) {
                    if (error) {
                        cb(error, null);
                    } else {
                        cb(null, docs);
                    }
                });
            }
        }
    }
    // End
    // ===================================

    // ===================================
    // Check Exist Item
    app.services._checkExist = function (query, collection_name, cb) {
        console.log("\x1b[34m", "------------------------------------");
        console.log("== > Method", "app.services._checkExist");
        console.log('== > DateTime', new Date());
        console.log("== > data", JSON.stringify(query));
        console.log("== > collection_name", collection_name);
        console.log("\x1b[34m", "------------------------------------\n \n");
        console.log("\x1b[0m");
        if (query && collection_name) {
            var COLLECTION = db[collection_name];
            COLLECTION.find(query, function (error, docs) {
                if (error) {
                    cb(error, null);
                } else {
                    if (!docs.length) {
                        cb(null, false);
                    } else {
                        cb(null, true);
                    }
                }

            });
        }

    }
    // End
    // ===================================

    // ===================================
    // Find Single item
    app.services.findOne = function (_query, _requireFields, collection_name, cb) {
        console.log("\x1b[34m", "------------------------------------");
        console.log("== > Method", "app.services.findOne");
        console.log('== > DateTime', new Date());
        console.log("== > data", JSON.stringify(_query));
        console.log("== > collection_name", collection_name);
        console.log("\x1b[34m", "------------------------------------\n \n");
        console.log("\x1b[0m");
        if (_query && collection_name) {
            var COLLECTION = db[collection_name];
            COLLECTION.findOne(_query, _requireFields, function (error, docs) {
                if (error) {
                    cb(error, null);
                } else {
                    cb(null, docs);
                }
            })
        }
    }
    // End
    // ===================================

    // ===================================
    // Update Item
    app.services._findAndUpdate = function (_query, _updateObject, collection_name, cb) {
        console.log("\x1b[34m", "------------------------------------");
        console.log("== > Method", "app.ervices.updateOne");
        console.log('== > DateTime', new Date());
        console.log("== > data", JSON.stringify(_query));
        console.log("== > UpdateObject", JSON.stringify(_updateObject))
        console.log("== > collection_name", collection_name);
        console.log("\x1b[34m", "------------------------------------\n \n");
        console.log("\x1b[0m");
        if (_query && _updateObject && collection_name) {
            var COLLECTION = db[collection_name];
            COLLECTION.findOneAndUpdate(_query, { $set: _updateObject }, { new: true }, function (error, docs) {
                if (error) {
                    cb(error, null);
                } else {
                    cb(null, docs);
                }
            });
        }
    }

    // ===================================
    // Get Item Query
    app.services._filterItems = function (_query, _requireFields, collection_name, cb) {
        console.log("\x1b[34m", "------------------------------------");
        console.log("== > Method", "app.services._filterItems");
        console.log('== > DateTime', new Date());
        console.log("== > data", JSON.stringify(_query));
        console.log("== > collection_name", collection_name);
        console.log("\x1b[34m", "------------------------------------\n \n");
        if (_query && collection_name) {
            var pagination = { limit: 10 };
            if (_query.limit && Number(_query.limit) != pagination.limit) {
                pagination.limit = Number(_query.limit);
            }
            if (_query.page && _query.page > 0) {
                pagination.skip = pagination.limit * Number(_query.page);
            }
            var limit = pagination.limit;
            var page = _query.page || 0;
            delete _query.limit;
            delete _query.page;
            var COLLECTION = db[collection_name];
            var countQuery = COLLECTION.count();
            console.log(countQuery);
            COLLECTION.count(_query, function (err, count) {
                COLLECTION.find(_query, _requireFields, pagination, function (error, docs) {
                    if (error) {
                        cb(error, null);
                    } else {
                        cb(null, { 
                            rows: docs,
                            count: count,
                            limit: limit,
                            page: page + 1,
					        totalPages: Math.ceil(count / limit),
                         });
                    }
                });
            });

        }
    }

    // ===================================
    // Delete Item
    app.services._deleteItem = function (item_id, collection_name, cb) {
        console.log("\x1b[34m", "------------------------------------");
        console.log("== > Method", "app.services.deleteItem");
        console.log('== > DateTime', new Date());
        console.log("== > data", item_id);
        console.log("== > collection_name", collection_name);
        console.log("\x1b[34m", "------------------------------------\n \n");
        if (item_id && collection_name) {
            var COLLECTION = db[collection_name];
            COLLECTION.remove({ _id: item_id }, function (error) {
                if (error) {
                    cb(error, null);
                } else {
                    cb(null, "Successfully Remove item");
                }
            })
        } else {
            cb("Invalid Parametes", null);
        }
    }

    // ===================================
    // Permenent Delete Item



    //  app.services.findOneWithPopulate = function (_query, _requireFields, collection_name, refs,cb) {
    //     console.log("\x1b[34m", "------------------------------------");
    //     console.log("== > Method", "app.services.findOne");
    //     console.log('== > DateTime', new Date());
    //     console.log("== > data", JSON.stringify(_query));
    //     console.log("== > collection_name", collection_name);
    //     console.log("\x1b[34m", "------------------------------------\n \n");
    //     console.log("\x1b[0m");
    //     if(typeof refs == 'array'){
    //         refs  = refs.toString();
    //         refs = refs.replace(","," ");
    //     }
    //     if (_query && collection_name) {
    //         var COLLECTION = db[collection_name];
    //         COLLECTION

    //         .populate({
    //             model:'User',
    //             select:'name lastname email',
    //             as:'Vendor'
    //         })
    //         .populate({

    //         })
    //         .findOne(_query, _requireFields).populate(refs).exec(function (error, docs) {
    //             if (error) {
    //                 cb(error, null);
    //             } else {
    //                 cb(null, docs);
    //             }
    //         })

    //     }
    // }

}