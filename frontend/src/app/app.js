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
            url: '/addPlace',
            component: 'addPlace'
        });
    })
    .value('$routerRootComponent', 'app')
    .component('app', AppComponent)
    .component('navbar', Navbar)
    .component('login', Login)
    .component('register', Register)
    .component('places', Places)
    .component('addPlace', AddPlace);

angular
    .element(document)
    .ready(() => angular.bootstrap(document, ['synopsis']));

export default AppController;