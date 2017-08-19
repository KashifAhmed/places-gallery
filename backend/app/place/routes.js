'use strict';
var path = require('path');

module.exports = function(app, router, scope) {
    router.route('/place/:id?')
        .post(app.services._authorization, scope.controllers._createItem)
        .get(app.services._authorization, scope.controllers._itemDetails)
        .put(app.services._authorization, scope.controllers._updateItem)
        .delete(app.services._authorization, scope.controllers._deleteItem);

    router.route('/search')
        .get(app.services._authorization, scope.controllers._searchItems);


    router.route('/favorite/:id?')
        .post(app.services._authorization, scope.controllers._markFavoriteItem)
        .get(app.services._authorization, scope.controllers._getFavoriteItem);


    router.route('/file/upload').post(function(req, res) {
        if (!req.files) {
            res.send({
                "message": "file Not found"
            });
        } else {
            let sampleFile = req.files.sampleFile;
            console.log(req.files.sampleFile);
            var fileName = new Date();
            var Url = path.resolve(__dirname, '../../public/uploads/' + fileName.getTime() + '.jpg');
            // Use the mv() method to place the file somewhere on your server 
            sampleFile.mv(Url, function(err) {
                if (err)
                    return res.status(500).send(err);

                res.send('File uploaded!');
            });
        }
    });
};