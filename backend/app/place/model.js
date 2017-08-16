'use strict';

module.exports = function(app, db, scope) {
    var _Schema = db.Schema,
        _dBSchema = new _Schema({
            locationName: {
                type: String,
                index: true,
                trim: true,
                required: true
            },
            description: {
                type: String,
                index: true,
                trim: true,
                required: true
            },
            zipCode: {
                type: Number,
                index: true,
                trim: true,
                required: true
            },
            province: {
                type: String,
                index: true,
                trim: true,
                required: true
            },
            country: {
                type: String,
                index: true,
                trim: true,
                required: true
            },
            city: {
                type: String,
                index: true,
                trim: true,
                required: true
            },
            address: {
                type: String,
                index: true,
                trim: true,
                required: true
            },
            geometry: {
                type: { type: String },
                coordinates: [Number],
            },
            created_by: {
                type: _Schema.ObjectId,
                required: true,
                ref: 'User'
            },
            is_deleted: {
                type: Boolean,
                default: false
            }
        }, { timestamps: true });

    _dBSchema.index({ "loc": "2dsphere" });
    var _Place = db.model(scope.collectionName, _dBSchema);
    db[scope.collectionName] = _Place;

};