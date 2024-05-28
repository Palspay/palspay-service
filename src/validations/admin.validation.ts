const Joi = require('joi');

const createPlans = {
    body: Joi.object().keys({
        plan_name: Joi.string().required(),
        plan_amount: Joi.string().required(),
        currency:Joi.string().required(),
        plan_type:Joi.string().required()
    }),
};


module.exports = {
    createPlans
};
