import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  name: String
});

export default mongoose.model('User', userSchema);
