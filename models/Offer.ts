import mongoose from 'mongoose';

import Product from '../interfaces/Product';
import Offer from '../interfaces/Offer';

const arrayLimit = (val:Product[]):boolean => !!(val.length && val.length <= 3);

const schema = new mongoose.Schema<Offer>({
  items: {
    type: [mongoose.Types.ObjectId],
    ref: 'Product',
    validate: [arrayLimit, '{PATH} has to have at least one item and exceeds the limit of 3'],
    required: true
  },
  price: {
    type: Number,
    min: 0.01,
    max: 9999999,
    required: true
  },
  expires: {
    type: Date,
    required: true
  },
  __v: {
    type: Number,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  }
});

export default mongoose.model<Offer>('Offer', schema);
