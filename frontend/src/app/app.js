import angular from 'angular';
import ComponentRouter from '@angular/router/angular1/angular_1_router';
import UISelect from 'angular-ui-select/select.min';
import ngSanitize from 'angular-sanitize';
import Navbar from 'components/navbar/navbar';
import Login from 'components/login/login';
import Register from 'components/register/register';
import ServiceFactory from './app.utils';
import router from 'angular-ui-router';
import Places from './components/places/places'
import AddPlace from './components/addPlace/addPlace'
import Api from './services/api.service'

import '../style/app.scss';
import 'angular-ui-select/select.min.css';

let AppComponent = {
    template: `
        <div class="container-fluid">
          <navbar></navbar>
          <ui-view></ui-view>
        </div>
    `,
    controller: () => new AppController()
};

class AppController {}

angular
    .module('synopsis', ['ngComponentRouter', 'ui.select', 'ngSanitize', 'ui.router'])
    .config(($locationProvider, $stateProvider) => {
        $locationProvider.html5Mode(true);

        $stateProvider.state('login', {
            url: '/login',
            component: 'login'
        });
        $stateProvider.state('register', {
            url: '/register',
            component: 'register'
        });
        $stateProvider.state('places', {
            url: '/places',
            component: 'places'
        });
        $stateProvider.state('addPlace', {
            url: 'addPlace/:id',
            params: {
                id: null
            },
            component: 'addPlace'
        });
    })
    .value('$routerRootComponent', 'app')
    .component('app', AppComponent)
    .component('navbar', Navbar)
    .component('login', Login)
    .component('register', Register)
    .component('places', Places)
    .component('addPlace', AddPlace)
    .service('api', Api)
    .directive('googleplace', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, model) {
                var options = {
                    types: [],
                    componentRestrictions: {}
                };
                scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

                google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                    scope.$apply(function() {
                        model.$setViewValue(scope.gPlace.getPlace());
                    });
                });
            }
        };
    })
    .directive('fileModel', ['$parse', function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function() {
                    scope.$apply(function() {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }])
    .run(() => {
        console.log('loadScript')
            // use global document since Angular's $document is weak
        var s = document.createElement('script')
        s.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyALcGIIePykjVHVDZuslDg-D-ros9C4NXI&amp&libraries=places'
        document.body.appendChild(s)
    })

angular
    .element(document)
    .ready(() => angular.bootstrap(document, ['synopsis']));

export default AppController;