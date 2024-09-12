const express = require('express');
const paymentLinkController = require('../../controllers/paymentLink.controller');

const router = express.Router();

// Route to generate a payment link
router.post('/generateLink', paymentLinkController.createPaymentLink);

module.exports = router;
