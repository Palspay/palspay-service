import express from 'express';
import authRoute from './auth.routes.js';
import userRoute from './user.routes.js';
import expaseRoute from './expanses.routes.js';
import adminRoutes from './admin.routes.js';
import paymentRoutes from './payment.routes.js';

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


export default router;