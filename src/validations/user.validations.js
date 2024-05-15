import Joi from 'joi';
import { password, passcode } from './custom.validations.js';

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

const profile = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        name: Joi.string().required(),
        mobile: Joi.string().required(),
        timezone: Joi.string().required(),
        currency: Joi.string().required(),
    }),
};

const takePlan = {
    body: Joi.object().keys({
        plan_id: Joi.string().required(),
        plan_type:Joi.string().required()
    }),
}

export default {
    addfriends,
    createGroup,
    createExpanse,
    groupDetailsByGroupId,
    setPasscode,
    profile,
    takePlan
};
