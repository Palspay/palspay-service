"use strict";
var express = require('express');
var validate = require('../../middlewares/validate');
var expanseController = require('../../controllers/expanse.controller');
var auth = require('../../middlewares/auth').auth;
var router = express.Router();
router.post('/createExpanse', auth, expanseController.addExpanse);
router.put('/updateExpanse/:id', auth, expanseController.updateExpanse);
router.delete('/deleteExpanse/:id', auth, expanseController.deleteExpanse);
router.get('/fetchExpanse/:id', auth, expanseController.fetchExpanse);
router.post('/getexpanse', auth, expanseController.getExpanse); // by getExpanse by group id
router.get('/individualExpanse', auth, expanseController.individualExpanse); //TODO - fix you borrowed money && remove current user expanse from response list
module.exports = router;
//# sourceMappingURL=expanses.routes.js.map