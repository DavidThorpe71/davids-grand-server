import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  name: String
});

export default mongoose.model('User', UserSchema);
