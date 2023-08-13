import mongoose from 'mongoose';
import Admin from '../interfaces/Admin';

const schema = new mongoose.Schema<Admin>({
  username: {
    type: String,
    minlength: 5,
    maxlength: 70,
    required: true
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 70,
    required: true
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 1024,
    required: true
  }
});

export default mongoose.model<Admin>('Admin', schema);
