import express from 'express';
import { auth } from '../../middlewares/auth.js';
import paymentController from '../../controllers/payment.controller.js';
const router = express.Router();

router.post('/makePayment',auth,paymentController.paymentInitated);
router.get('/checkStatus', auth, paymentController.checkStatus);
router.get('/checkStatus/:txnId', auth, paymentController.checkStatus);
export default router;