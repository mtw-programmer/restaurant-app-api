import Joi from 'joi';

const schema = Joi.object().keys({
  title: Joi.string().min(1).max(30).required(),
  description: Joi.string().min(1).max(1024).required(),
  price: Joi.number().greater(0.01).less(9999999).required()
}).unknown(true);

export default (product:{ title: string; description: string; price: number }) => schema.validate(product);
