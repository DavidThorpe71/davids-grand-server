import mongoose from 'mongoose';
import mongodbErrorHandler from 'mongoose-mongodb-errors';

mongoose.Promise = global.Promise;
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  name: String
});

userSchema.plugin(mongodbErrorHandler);

export default mongoose.model('User', userSchema);
