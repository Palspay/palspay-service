"use strict";
var express = require('express');
var validate = require('../../middlewares/validate');
var adminValidation = require('../../validations/admin.validation');
var adminController = require('../../controllers/admin.controller');
var authAdmin = require('../../middlewares/auth').authAdmin;
var router = express.Router();
// @ts-ignore
router.post('/createplan', authAdmin, validate(adminValidation.createPlans), adminController.createPlans);
module.exports = router;
//# sourceMappingURL=admin.routes.js.map