import Joi from "joi";

export const createUserSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().max(500).required(),
    password: Joi.string().min(8).max(16).required()
});
