class placesController {

    constructor() {

    }
}

const Places = {
    template: require('./places.html'),
    controller: () => new placesController()
};

export default Places;