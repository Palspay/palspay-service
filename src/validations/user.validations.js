const Joi = require('joi');
const { password, passcode } = require('./custom.validations');

const addfriends = {
    body: Joi.object({
        mobile: Joi.array()
            .items(
                Joi.object({
                    name: Joi.string().required(),
                    mobile: Joi.string().required()
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
const createExpanse = {
    body: Joi.object().keys({
        groupId: Joi.string().required(),
        totalExpanse: Joi.string().required(),
        description: Joi.string().required(),
    }),
};

const groupDetailsByGroupId = {
    body: Joi.object().keys({
        group_id: Joi.string().required(),
    }),
}

const setPasscode = {
    body: Joi.object().keys({
        passcode: Joi.number().required().custom(passcode),
    }),
}
module.exports = {
    addfriends,
    createGroup,
    createExpanse,
    groupDetailsByGroupId,
    setPasscode
};
