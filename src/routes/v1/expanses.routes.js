const express = require('express');
const validate = require('../../middlewares/validate');
const useralidation = require('../../validations/user.validations');
const expanseController = require('../../controllers/expanse.controller');
const auth = require('../../middlewares/auth');
const router = express.Router();

router.post('/addExpanse', auth, validate(useralidation.createExpanse), expanseController.addExpanse);

module.exports = router;