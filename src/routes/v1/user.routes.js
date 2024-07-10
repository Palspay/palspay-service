const express = require('express');
const validate = require('../../middlewares/validate');
const uservalidation = require('../../validations/user.validations');
const userController = require('../../controllers/users.controller');
const { auth, authGroupOwner } = require('../../middlewares/auth');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const mime = require('mime');
// @ts-ignore
router.post('/addfriends', auth, validate(uservalidation.addfriends), userController.addFriends);
router.get('/friends', auth, userController.getFriends);
// @ts-ignore
router.post('/groups', auth, validate(uservalidation.createGroup), userController.createGroups);

router.get('/group-details/:group_id', auth, userController.getMembersByGroupId);
router.get('/mygroups', auth, userController.getMyGroups);
router.get('/user/:user_id', auth, userController.getUserDetails);
// @ts-ignore
router.post('/setpasscode', auth, validate(uservalidation.setPasscode), userController.setPasscode);
// @ts-ignore
router.post('/edit-profile', auth, validate(uservalidation.profile), userController.editProfile);

router.get('/timezones', auth, userController.getAllTimezones);

router.post('/uploads', userController.uploadFile);

router.put('/leave-group', auth, userController.leaveGroup);
router.put('/leave-group/:group_id', auth, userController.leaveGroup);
router.put('/group-settings/:group_id', auth, authGroupOwner, userController.groupSettings);

router.delete('/delete-group', auth, userController.deleteGroup);
router.delete('/delete-group/:group_id', auth, userController.deleteGroup);

router.delete('/remove-friend', auth, userController.removeFriend);
router.delete('/remove-friend/:user_id', auth, userController.removeFriend);

// @ts-ignore
router.post('/take-plan', auth, validate(uservalidation.takePlan), userController.takePlan);

router.get('/activity', auth, userController.getActivity);
router.get('/transactions', auth, userController.getTransactions);

router.get('/common-groups/:userId', auth, userController.getCommonGroups);
router.get('/group-wallet/:groupId', auth, userController.getGroupWallet);
router.post('/report-user', auth, userController.reportUser);

router.get('/uploads/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, '../../../', 'public/uploads', imageName);
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File does not exist
      res.status(404).send('Image not found');
    } else {
      // @ts-ignore
      const mimeType = mime.getType(imageName);
      res.setHeader('Content-Type', mimeType);
      res.sendFile(imagePath);
    }
  });
});
module.exports = router;
