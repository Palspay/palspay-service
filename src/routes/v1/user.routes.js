const express = require('express');
const validate = require('../../middlewares/validate');
const useralidation = require('../../validations/user.validations');
const userController = require('../../controllers/users.controller');
const auth = require('../../middlewares/auth');
const router = express.Router();

router.post('/addfriends', auth, validate(useralidation.addfriends), userController.addFriends);


module.exports = router;