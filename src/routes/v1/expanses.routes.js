const express = require('express');
const validate = require('../../middlewares/validate');
const expanseController = require('../../controllers/expanse.controller');
const {auth} = require('../../middlewares/auth');
const router = express.Router();

router.post('/createExpanse', auth, expanseController.addExpanse);
router.put('/updateExpanse/:id', auth, expanseController.updateExpanse);
router.delete('/deleteExpanse/:id', auth, expanseController.deleteExpanse);
router.get('/fetchExpanse', auth, expanseController.fetchExpanse);
router.post('/getexpanse', auth, expanseController.getExpanse); // by getExpanse by group id
router.get('/individualExpanse', auth, expanseController.individualExpanse); //TODO - fix you borrowed money && remove current user expanse from response list
 
module.exports = router;