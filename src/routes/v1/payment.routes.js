const express = require('express');
const {auth} = require('../../middlewares/auth');
const paymentController = require('../../controllers/payment.controller');
const router = express.Router();

router.post('/makePayment',auth,paymentController.paymentInitated);
router.get('/checkStatus', auth, paymentController.checkStatus);
router.get('/checkStatus/:txnId', auth, paymentController.checkStatus);
module.exports = router;