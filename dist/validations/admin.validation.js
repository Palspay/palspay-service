"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Joi = require('joi');
var createPlans = {
    body: Joi.object().keys({
        plan_name: Joi.string().required(),
        plan_amount: Joi.string().required(),
        currency: Joi.string().required(),
        plan_type: Joi.string().required()
    }),
};
module.exports = {
    createPlans: createPlans
};
//# sourceMappingURL=admin.validation.js.map