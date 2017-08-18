export default class Api {
    constructor($http) {
        'ngInject';

        this._api = 'http://localhost:8080/api';
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
                password: credentials.password
            }
        });
    }

}