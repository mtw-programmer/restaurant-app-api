import { ObjectId, Document } from 'mongoose';

export default interface Product extends Document {
  _id: ObjectId;
  title: string;
  img: string;
  description: string;
  price: number;
  expires: Date;
  createdAt: Date;
}
