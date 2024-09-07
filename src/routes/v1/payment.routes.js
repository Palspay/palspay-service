const { validateVPA } = require('../../middlewares/payment');
const express = require('express');
const { auth } = require('../../middlewares/auth');
const paymentController = require('../../controllers/payment.controller');
const router = express.Router();

router.post('/initiatePayment', auth, validateVPA,  paymentController.paymentInitated); /*auth, validateVPA,*/
router.post('/payout', auth, paymentController.payoutInitated);
router.post('/refund', auth, paymentController.refundInitiated);
router.post('/addToWallet', auth, paymentController.addToWallet);
router.post('/pay', auth, paymentController.makePayment);
router.post('/payToPalspay', auth, paymentController.payToPalspay);
router.post('/initiatePaymentWithourVPA', auth,  paymentController.paymentInitated);
router.post('/settlement', auth, paymentController.settlementInitiated);
router.get('/settlements/user', auth, paymentController.getUserSettlements);
router.get('/settlements/group', auth, paymentController.getGroupSettlements);

// router.get('/checkStatus', auth, paymentController.checkStatus);
// router.get('/checkStatus/:txnId', auth, paymentController.checkStatus);
module.exports = router;