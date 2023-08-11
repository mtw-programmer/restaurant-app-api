import { ObjectId } from 'mongoose';

export default interface Product {
  _id: ObjectId;
  title: string;
  img: string;
  description: string;
  price: number;
  expires: Date;
  createdAt: Date;
};
