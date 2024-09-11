const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validations');
const authController = require('../../controllers/auth.controller');

const router = express.Router();

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

router.post('/facebookLogin', validate(authValidation.googleLogin), authController.facebookLogin);

module.exports = router;