import Joi from "joi";

export const credentialSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});