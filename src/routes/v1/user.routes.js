const express = require('express');
const validate = require('../../middlewares/validate');
const useralidation = require('../../validations/user.validations');
const userController = require('../../controllers/users.controller');
const auth = require('../../middlewares/auth');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const mime = require('mime');
router.post('/addfriends', auth, validate(useralidation.addfriends), userController.addFriends);
router.get('/friends', auth, userController.getFriends);
router.post('/groups', auth, validate(useralidation.createGroup), userController.createGroups);

router.get('/group-details', auth, validate(useralidation.groupDetailsByGroupId), userController.getMembersByGroupId);
router.get('/mygroups', auth, userController.getMyGroups);
router.post('/setpasscode', auth, validate(useralidation.setPasscode), userController.setPasscode);
router.post('/edit-profile', auth, validate(useralidation.profile), userController.editProfile);

router.get('/timezones', auth, userController.getAllTimezones);

router.post('/uploads', userController.uploadFile);


router.get('/uploads/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, '../../../public', 'uploads', imageName);
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