class addPlaceController {

    constructor(api) {
        this.api = api;
        this.form = {};
    }

    createNewPlace(){
        var fd = new FormData();
        fd.append("placeImage", this.form[0]);
        fd.append()
    }
}

const AddPlace = {
    template: require('./addPlace.html'),
    controller: (api) => new addPlaceController(api),
    controllerAs: 'addPlaceCtrl'
};

export default AddPlace;