const express = require('express');
const authRoute = require('./auth.routes');
const userRoute = require('./user.routes');
const expaseRoute = require('./expanses.routes');
const router = express.Router();
const defaultRoutes = [{
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
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});


module.exports = router;