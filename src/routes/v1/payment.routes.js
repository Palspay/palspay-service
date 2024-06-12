const { validateVPA } = require('../../middlewares/payment');
const express = require('express');
const { auth } = require('../../middlewares/auth');
const paymentController = require('../../controllers/payment.controller');
const router = express.Router();

router.post('/initiatePayment', /*auth, validateVPA,*/ paymentController.paymentInitated);
router.post('/payout', /*auth,*/ paymentController.payoutInitated);
router.post('/refund', auth, paymentController.refundInitiated);
router.post('/addToWallet', auth, paymentController.addToWallet);
router.post('/pay', auth, paymentController.makePayment);
// router.get('/checkStatus', auth, paymentController.checkStatus);
// router.get('/checkStatus/:txnId', auth, paymentController.checkStatus);
module.exports = router;