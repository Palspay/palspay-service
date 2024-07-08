const Joi = require('joi');
const { password, passcode } = require('./custom.validations');

export const addFriends = {
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

const profile = {
    body: Joi.object().keys({
        name: Joi.string(),
        mobile: Joi.string(),
        timezone: Joi.string(),
        currency: Joi.string(),
        vpa: Joi.string(),
    }),
};

const takePlan = {
    body: Joi.object().keys({
        plan_id: Joi.string().required(),
        plan_type:Joi.string().required()
    }),
}

module.exports = {
    addFriends,
    createGroup,
    createExpanse,
    groupDetailsByGroupId,
    setPasscode,
    profile,
    takePlan
};
