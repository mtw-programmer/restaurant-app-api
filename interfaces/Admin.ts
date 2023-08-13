import { ObjectId, Document } from 'mongoose';

export default interface Admin extends Document {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
}
