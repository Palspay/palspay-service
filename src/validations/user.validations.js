const Joi = require('joi');
const { password } = require('./custom.validations');

const addfriends = {
  body: Joi.object({
    mobile: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          mobile: Joi.string().pattern(/^[0-9]+$/).required()
        })
      )
      .required(),
    group_id: Joi.string().optional()
  })
};
const createGroup = {
  body: Joi.object().keys({
    group_name: Joi.string().required(),
    group_icon: Joi.string().optional(),
  }),
};

const groupDetailsByGroupId = {
  body: Joi.object().keys({
    group_id: Joi.string().required(),
  }),
}
module.exports = {
  addfriends,
  createGroup,
  groupDetailsByGroupId
};