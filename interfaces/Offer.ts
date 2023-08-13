import { ObjectId, Document } from 'mongoose';
import Product from './Product';

export default interface Offer extends Document {
  _id: ObjectId;
  items: Product['_id'][];
  price: number;
  expires: Date;
  createdAt: Date;
}
