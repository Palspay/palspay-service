const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validations');
const authController = require('../../controllers/auth.controller');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/verifyotp', validate(authValidation.verifyOtp), authController.verifyOtp);
router.post('/login', validate(authValidation.login), authController.login);


module.exports = router;