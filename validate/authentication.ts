import Joi from 'joi';

const schema = Joi.object().keys({
  username: Joi.string().min(5).max(70).required(),
  password: Joi.string().min(8).max(70).required(),
}).unknown(true);

export default (admin:{ username: string, password: string }) => schema.validate(admin);
