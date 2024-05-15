import express from 'express';
import validate from '../../middlewares/validate.js';
import authValidation from '../../validations/auth.validations.js';
import authController from '../../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/verifyotp', validate(authValidation.verifyOtp), authController.verifyOtp);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/verify-user', validate(authValidation.verifyUser), authController.verifyUser);
router.post('/forgot-password', validate(authValidation.createPassword), authController.createNewPassword);


export default router;