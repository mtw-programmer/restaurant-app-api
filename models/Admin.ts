import mongoose from 'mongoose';

const schema = new mongoose.Schema({
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

export default mongoose.model('Admin', schema);
