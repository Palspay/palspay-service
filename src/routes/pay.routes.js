const express = require('express');
const router = express.Router();
const paymentLinkController = require('../controllers/paymentLink.controller');

// Route to get payment link details by code (GET request)
router.get('/:code', paymentLinkController.getPaymentLinkDetails);

module.exports = router;
