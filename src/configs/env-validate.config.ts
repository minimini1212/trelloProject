import Joi from 'joi';

export const configModuleValidationSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.string().required().default(3306),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SYNC: Joi.string().required().default(true),
  PASSWORD_HASH_ROUNDS: Joi.number().required().default(10),
  JWT_SECRET_KEY: Joi.string().required(),
});
