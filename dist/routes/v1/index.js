"use strict";
var express = require('express');
var authRoute = require('./auth.routes');
var userRoute = require('./user.routes');
var expaseRoute = require('./expanses.routes');
var adminRoutes = require('./admin.routes');
var paymentRoutes = require('./payment.routes');
var router = express.Router();
var defaultRoutes = [{
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/users',
        route: userRoute,
    },
    {
        path: '/expanses',
        route: expaseRoute,
    },
    {
        path: '/admin',
        route: adminRoutes,
    },
    {
        path: '/payments',
        route: paymentRoutes,
    },
];
defaultRoutes.forEach(function (route) {
    router.use(route.path, route.route);
});
module.exports = router;
//# sourceMappingURL=index.js.map