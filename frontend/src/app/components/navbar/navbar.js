class NavBarController {

    constructor($state, api) {

        this.brand = 'Synopsis';
        this.$state = $state;
        this.api = api;


    }
    loadPlaces() {
        this.$state.go('places');
    }

    logout() {
        this.api.clearLogin();
        this.$state.go('login');
    }

}

const Navbar = {
    template: require('./navbar.html'),
    controller: ($state, api) => new NavBarController($state, api),
    controllerAs: 'navCtrl'
};

export default Navbar;