const express = require('express');
const app = express();
const PaymentLink = require('../models/paymentLink.model');


app.get('/pay/', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Missing code');
  }

  const link = await PaymentLink.findOne({ code });

  if (!link) {
    return res.status(404).send('Link not found');
  }

  // Redirect or respond with payment details
  res.json(link); // Or you can redirect to a specific page with details
});

