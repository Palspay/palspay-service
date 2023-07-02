const Joi = require('joi');
const { password } = require('./custom.validations');

const addfriends = {
  body: Joi.object().keys({
    mobile: Joi.string().pattern(/^[0-9]+$/).required(),
  }),
};

module.exports = {
    addfriends
};