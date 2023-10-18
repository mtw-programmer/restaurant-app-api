import Joi from 'joi';

const schema = Joi.object().keys({
  title: Joi.string().min(1).max(30),
  description: Joi.string().min(1).max(1024),
  price: Joi.number().greater(0.01).less(9999999)
}).unknown(true);

export default (product:{ title?: string; description?: string; price?: number }) => schema.validate(product);
