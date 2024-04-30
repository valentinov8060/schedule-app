import Joi from "joi";

const loginUserValidationSchema = Joi.object({
  user: Joi.string().max(255).required(),
  password: Joi.string().max(255).required()
});

const authorizationValidationSchema = Joi.string().min(36).max(36).required()

export { 
  loginUserValidationSchema,
  authorizationValidationSchema
}