class addPlaceController {

    constructor(api, $stateParams) {
        this.api = api;
        this.form = {};
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
                    $state.go('place');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    updatePlace() {
        this.api.updatePlace(this.form)
            .then(function(response) {
                if (response.status == 200) {
                    $state.go('place');
                }
            })
            .catch(function(error) {
                console.log(error);
            })
    }
}

const AddPlace = {
    template: require('./addPlace.html'),
    controller: (api, $stateParams) => new addPlaceController(api, $stateParams),
    controllerAs: 'addPlaceCtrl'
};

export default AddPlace;