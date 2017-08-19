class addPlaceController {

    constructor(api, $stateParams, $state) {
        this.api = api;
        this.form = {};
        this.$state = $state;
        if ($stateParams.id) {
            this.api.getPlaceDetails($stateParams.id)
                .then((response) => {
                    if (response.status == 200) {
                        this.form = response.data.data;
                        console.log(this.form);
                    } else {
                        console.log(response);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    submitForm() {
        if (this.form._id) {
            this.updatePlace();
        } else {
            this.createNewPlace();
        }
    }

    createNewPlace() {
        var fd = new FormData();
        fd.append("placeImage", this.form.photo);
        fd.append('latLng', JSON.stringify(this.form.address.geometry.location.toJSON()));
        fd.append('locationName', this.form.locationName);
        fd.append('description', this.form.description);
        fd.append('zipCode', this.form.zipCode);
        fd.append('province', this.form.province);
        fd.append('country', this.form.country);
        fd.append('city', this.form.city);
        fd.append('address', this.form.address.formatted_address);
        this.api.createPlace(fd)
            .then((response) => {
                if (response.status == 200) {
                    this.$state.go('places');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    updatePlace() {
        var _query = angular.copy(this.form);
        if (typeof _query.address == "string") {
            delete _query.geometry;
        } else {
            var geomertry = this.form.address.geometry.location.toJSON();
            _query.address = this.form.address.formatted_address;
            _query.latLng = [geomertry.lat, geomertry.lng];
        }
        this.api.updatePlace(this.form)
            .then((response) => {
                if (response.status == 200) {
                    this.$state.go('places');
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }
}

const AddPlace = {
    template: require('./addPlace.html'),
    controller: (api, $stateParams, $state) => new addPlaceController(api, $stateParams, $state),
    controllerAs: 'addPlaceCtrl'
};

export default AddPlace;