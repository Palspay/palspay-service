"use strict";
var validateVPA = require('../../middlewares/payment').validateVPA;
var express = require('express');
var auth = require('../../middlewares/auth').auth;
var paymentController = require('../../controllers/payment.controller');
var router = express.Router();
router.post('/initiatePayment', /*auth, validateVPA,*/ paymentController.paymentInitated);
router.post('/payout', /*auth,*/ paymentController.payoutInitated);
router.post('/refund', auth, paymentController.refundInitiated);
router.post('/addToWallet', auth, paymentController.addToWallet);
router.post('/pay', auth, paymentController.makePayment);
// router.get('/checkStatus', auth, paymentController.checkStatus);
// router.get('/checkStatus/:txnId', auth, paymentController.checkStatus);
module.exports = router;
//# sourceMappingURL=payment.routes.js.map