import * as Joi from '@hapi/joi';

const newUserSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),

    access: Joi.number()
        .max(3)
        .min(1),

    userName: Joi.string()
        .email({ minDomainSegments: 2})
        .required(),

    calorie: Joi.number()
        .min(0),
}).unknown();

const updateUserSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .allow(''),

    access: Joi.number()
        .max(3)
        .min(1),

    userName: Joi.string()
        .email({ minDomainSegments: 2})
        .required()
        .allow(''),

    calorie: Joi.number()
        .min(0),
}).unknown();

const loginSchema = Joi.object({
    password: Joi.string()
    // .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),

    userName: Joi.string()
        .email({ minDomainSegments: 2})
        .required(),
}).unknown();

export {
    newUserSchema,
    loginSchema,
    updateUserSchema,
};
