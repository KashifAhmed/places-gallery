'use strict';

module.exports = function(app, db, scope) {
    var roles = ['user', 'admin'],
        _Schema = db.Schema,
        _UserSchema = new _Schema({
            first_name: {
                type: String,
                index: true,
                trim: true,
                required: true
            },
            last_name: {
                type: String,
                index: true,
                trim: true,
                required: true
            },
            email: {
                type: String,
                match: /^\S+@\S+\.\S+$/,
                index: true,
                unique: true,
                trim: true,
                lowercase: true,
                sparse: true
            },
            password: {
                type: String,
                required: true,
                minlength: 6
            },
            role: {
                type: String,
                enum: roles,
                default: 'customer'
            },
            favorite: {
                type: [String]
            },
            access_token: {
                type: String
            },
            is_deleted: {
                type: Boolean,
                default: false,
            }
        }, { timestamps: true });


    var _User = db.model(scope.collectionName, _UserSchema);
    db[scope.collectionName] = _User;

};