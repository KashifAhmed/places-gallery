export default class Api {
    constructor($http) {
        'ngInject';

        this._api = 'http://localhost:5000/api';
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
    searchPlaces(query){
        var headers = JSON.parse(localStorage.getItem('placeGallery_headers'));
        return this._$http({
            url: this._api + '/place',
            method: 'GET',
            headers: headers,
            params: query
        });
    }

    markFavorite(id){
        var headers = JSON.parse(localStorage.getItem('placeGallery_headers'));
        return this._$http({
            url: this._api + '/favorite/'+id,
            method: 'POST',
            headers: headers
        });
    }

    
    
    // For setting headers
    setHeader(key,value){
        var headers = JSON.parse(localStorage.getItem('placeGallery_headers')) || {};
        headers[key] = value;
        headers = JSON.stringify(headers);
        localStorage.setItem('placeGallery_headers', headers);        

    }

}