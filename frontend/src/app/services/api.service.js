export default class Api {
    constructor($http) {
        'ngInject';

        this._api = 'http://localhost:8000/api';
        this._$http = $http;


        // Object to store our user properties
        this.current = null;
    }


    attemptAuth(credentials) {
        return this._$http({
            url: this._api + '/login',
            method: 'POST',
            data: {
                email: credentials.email,
                password: credentials.password,
                role: 'user'
            }
        });
    }
    searchPlaces(query) {
        var headers = JSON.parse(localStorage.getItem('placeGallery_headers'));
        return this._$http({
            url: this._api + '/search',
            method: 'GET',
            headers: headers,
            params: query
        });
    }

    markFavorite(id) {
        var headers = JSON.parse(localStorage.getItem('placeGallery_headers'));
        return this._$http({
            url: this._api + '/favorite/' + id,
            method: 'POST',
            headers: headers
        });
    }


    createPlace(data) {
        var headers = JSON.parse(localStorage.getItem('placeGallery_headers'));
        headers['Content-Type'] = undefined;
        headers['withCredentials'] = true;
        return this._$http({
            url: this._api + '/place',
            method: 'POST',
            headers: headers,
            transformRequest: angular.identity,
            data: data
        });
    }

    getPlaceDetails(id) {
        var headers = JSON.parse(localStorage.getItem('placeGallery_headers'));
        return this._$http({
            url: this._api + '/place/' + id,
            method: 'GET',
            headers: headers
        });
    }

    updatePlace(data) {
        var headers = JSON.parse(localStorage.getItem('placeGallery_headers'));
        return this._$http({
            url: this._api + '/place/' + data._id,
            method: 'PUT',
            headers: headers,
            data: data
        });
    }

    clearLogin() {
        localStorage.setItem('placeGallery_headers', JSON.stringify({}));
    }

    // For setting headers
    setHeader(key, value) {
        var headers = JSON.parse(localStorage.getItem('placeGallery_headers')) || {};
        headers[key] = value;
        headers = JSON.stringify(headers);
        localStorage.setItem('placeGallery_headers', headers);

    }

}