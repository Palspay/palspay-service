const express = require('express');
const validate = require('../../middlewares/validate');
const useralidation = require('../../validations/user.validations');
const userController = require('../../controllers/users.controller');
const auth = require('../../middlewares/auth');
const router = express.Router();

router.post('/addfriends', auth, validate(useralidation.addfriends), userController.addFriends);
router.get('/friends', auth, userController.getFriends);
router.post('/groups', auth, validate(useralidation.createGroup), userController.createGroups);



module.exports = router;