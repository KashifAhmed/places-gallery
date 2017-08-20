class placesController {

    constructor(api, $state) {
        this.api = api;
        this.$state = $state;
        this.itemsList;
        this.searchPlace();
        this.query = {};
    }

    searchPlace() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.query.latLng = [position.coords.latitude, position.coords.longitude];
            this.api.searchPlaces(this.query)
                .then((response) => {
                    if (response.status == 200) {
                        this.itemsList = response.data.data;
                        console.log(this.itemsList);
                    } else if (response.status == 401) {
                        this.$state.go('login')
                    } else {
                        console.log(response.data);
                    }
                })
                .catch((err) => {
                    if (err.status == 401) {
                        this.$state.go('login')
                    } else {
                        console.log(err);
                    }
                });
        });

    }

    markFavorite(place) {
        this.api.markFavorite(place._id)
            .then((response) => {
                if (response.status == 200) {
                    place.isFavorite = !place.isFavorite;
                } else {
                    console.log(response);
                }
            });
    }

    edit(id) {
        debugger;
        this.$state.go('addPlace', { id: id });
    }

    addNew() {
        this.$state.go('addPlace', { id: null });
    }

}

const Places = {
    template: require('./places.html'),
    controller: (api, $state) => new placesController(api, $state),
    controllerAs: 'placesCtrl'
};

export default Places;