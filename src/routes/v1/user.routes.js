const express = require('express');
const validate = require('../../middlewares/validate');
const useralidation = require('../../validations/user.validations');
const userController = require('../../controllers/users.controller');
const {auth} = require('../../middlewares/auth');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const { getCommonGroups } = require('../../controllers/users.controller');

router.post('/addfriends', auth, validate(uservalidation.addfriends), userController.addFriends);
router.get('/friends', auth, userController.getFriends);
router.post('/groups', auth, validate(useralidation.createGroup), userController.createGroups);

router.get('/group-details/:group_id', auth, userController.getMembersByGroupId);
router.get('/mygroups', auth, userController.getMyGroups);
router.post('/setpasscode', auth, validate(useralidation.setPasscode), userController.setPasscode);
router.post('/edit-profile', auth, validate(useralidation.profile), userController.editProfile);

router.get('/timezones', auth, userController.getAllTimezones);

router.post('/uploads', userController.uploadFile);

router.put('/leave-group', auth, userController.leaveGroup);
router.put('/leave-group/:group_id', auth, userController.leaveGroup);

router.delete('/delete-group', auth,userController.deleteGroup);
router.delete('/delete-group/:group_id', auth,userController.deleteGroup);

router.delete('/remove-friend', auth,userController.removeFriend);
router.delete('/remove-friend/:user_id', auth,userController.removeFriend);

router.post('/take-plan', auth, validate(useralidation.takePlan), userController.takePlan);

router.get('/activity', auth, userController.getActivity);

router.get('/common-groups/:userId', auth, getCommonGroups);

router.get('/group-wallet/:groupId', auth, userController.getGroupWallet);

router.get('/uploads/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, '../../../', 'public/uploads', imageName);
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File does not exist
      res.status(404).send('Image not found');
    } else {
      const mimeType = mime.getType(imageName);
      res.setHeader('Content-Type', mimeType);
      res.sendFile(imagePath);
    }
  });
});
module.exports = router;
