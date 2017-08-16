'use strict';

module.exports = function (app, db, scope) {
    var _Schema = db.Schema,
        _dBSchema = new _Schema({
            title:{
                type: String,
                index: true,
                trim: true,
                required: true   
            },
            created_by: {
                type: _Schema.ObjectId,
                required: true
            },
            is_deleted:{
                type: Boolean,
                default: false
            }
        }, { timestamps: true });


    var _Category = db.model(scope.collectionName, _dBSchema);
    db[scope.collectionName] = _Category;

};