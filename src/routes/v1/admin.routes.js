import express from 'express';
import validate from '../../middlewares/validate.js';
import adminValidation from '../../validations/admin.validation.js';
import adminController from '../../controllers/admin.controller.js';
import { authAdmin } from '../../middlewares/auth.js';
const router = express.Router();

router.post('/createplan', authAdmin,  validate(adminValidation.createPlans),adminController.createPlans);

export default router;