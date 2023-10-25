import Joi from 'joi';

const schema = Joi.object().keys({
  items: Joi.array().min(1).max(3).items(Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()).required(),
  price: Joi.number().greater(0.01).less(9999999).required(),
  expires: Joi.date().required()
}).unknown(true);

export default (offer:{ items:string[], price:number, expires:Date }) => schema.validate(offer);
