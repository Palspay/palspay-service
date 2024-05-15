import Joi from 'joi';

const createPlans = {
    body: Joi.object().keys({
        plan_name: Joi.string().required(),
        plan_amount: Joi.string().required(),
        currency:Joi.string().required(),
        plan_type:Joi.string().required()
    }),
};


export default {
    createPlans
};
