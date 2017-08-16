
'use strict';
module.exports = function (app) {
    app.services._authorization = function (req, res, next) {
        console.log(req.headers)
        if (req.headers.authorization) {
            app.services.findOne({ access_token: req.headers.authorization }, '_id email first_name last_name role', 'User', function (error_findOne, success_findOne) {
                console.log('app.services.findOne', error_findOne, success_findOne);
                if (error_findOne == null) {
                    if (success_findOne && success_findOne._id) {
                        req.user = success_findOne;
                        next();
                    } else {
                        res.status(401).send({
                            code: 401,
                            success: false,
                            message: "Unauthorized user"
                        });
                    }
                } else {
                    res.status(401).send({
                        code: 401,
                        success: false,
                        message: "Unauthorized user"
                    });
                }

            });
        } else {
            res.status(401).send({
                code: 401,
                success: false,
                message: "Unauthorized user"
            });
        }
    }

    app.services._hasAdminAccess = function (req, res, next) {
        if (req.user.role && req.user.role == 'admin') {
            next();
        } else {
            res.status(401).send({
                code: 401,
                success: false,
                message: "You do not have Administrator access"
            });
        }
    }
}
