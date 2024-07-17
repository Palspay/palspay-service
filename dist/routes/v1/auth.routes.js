"use strict";
var express = require('express');
var validate = require('../../middlewares/validate');
var authValidation = require('../../validations/auth.validations');
var authController = require('../../controllers/auth.controller');
var router = express.Router();
// @ts-ignore
router.post('/register', validate(authValidation.register), authController.register);
// @ts-ignore
router.post('/verifyotp', validate(authValidation.verifyOtp), authController.verifyOtp);
// @ts-ignore
router.post('/login', validate(authValidation.login), authController.login);
// @ts-ignore
router.post('/verify-user', validate(authValidation.verifyUser), authController.verifyUser);
// @ts-ignore
router.post('/forgot-password', validate(authValidation.createPassword), authController.createNewPassword);
router.post('/googleLogin', validate(authValidation.googleLogin), authController.googleLogin);
module.exports = router;
//# sourceMappingURL=auth.routes.js.map