import { Document } from 'mongoose';

export default interface Admin extends Document {
  username: string;
  email: string;
  password: string;
}
