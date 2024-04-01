const express = require('express');
const authRoute = require('./auth.routes');
const userRoute = require('./user.routes');
const expaseRoute = require('./expanses.routes');
const adminRoutes=require('./admin.routes');
const paymentRoutes=require('./payment.routes');

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
    {
        path: '/admin',
        route: adminRoutes,
    },
    {
        path: '/payment',
        route: paymentRoutes,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});


module.exports = router;