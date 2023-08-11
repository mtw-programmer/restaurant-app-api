import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 1,
    maxLength: 30,
    required: true 
  },
  img: {
    type: String,
    minLength: 1,
    maxLength: 128,
    required: true 
  },
  description: {
    type: String,
    minLength: 1,
    maxLength: 1024,
    required: true 
  },
  price: {
    type: Number,
    min: 0.01,
    max: 9999999,
    required: true
  },
  __v: {
    type: Number,
    select: false
  }
});

export default mongoose.model('Product', schema);
