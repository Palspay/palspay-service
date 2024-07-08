const express = require('express');
const validate = require('../../middlewares/validate');
const adminValidation = require('../../validations/admin.validation');
const adminController = require('../../controllers/admin.controller');
const {authAdmin} = require('../../middlewares/auth');
const router = express.Router();

// @ts-ignore
router.post('/createplan', authAdmin,  validate(adminValidation.createPlans),adminController.createPlans);

module.exports = router;