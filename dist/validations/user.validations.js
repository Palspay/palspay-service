"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Joi = require('joi');
var _a = require('./custom.validations'), password = _a.password, passcode = _a.passcode;
var addfriends = {
    body: Joi.object({
        mobile: Joi.array()
            .items(Joi.object({
            name: Joi.string().required(),
            mobile: Joi.string().required()
        }))
            .required(),
        group_id: Joi.string().optional()
    })
};
var createGroup = {
    body: Joi.object().keys({
        group_name: Joi.string().required(),
        group_icon: Joi.string().optional(),
    }),
};
var createExpanse = {
    body: Joi.object().keys({
        groupId: Joi.string().required(),
        totalExpanse: Joi.string().required(),
        description: Joi.string().required(),
    }),
};
var groupDetailsByGroupId = {
    body: Joi.object().keys({
        group_id: Joi.string().required(),
    }),
};
var setPasscode = {
    body: Joi.object().keys({
        passcode: Joi.number().required().custom(passcode),
    }),
};
var profile = {
    body: Joi.object().keys({
        name: Joi.string(),
        mobile: Joi.string(),
        timezone: Joi.string(),
        currency: Joi.string(),
        vpa: Joi.string(),
    }),
};
var takePlan = {
    body: Joi.object().keys({
        plan_id: Joi.string().required(),
        plan_type: Joi.string().required()
    }),
};
module.exports = {
    addfriends: addfriends,
    createGroup: createGroup,
    createExpanse: createExpanse,
    groupDetailsByGroupId: groupDetailsByGroupId,
    setPasscode: setPasscode,
    profile: profile,
    takePlan: takePlan
};
//# sourceMappingURL=user.validations.js.map