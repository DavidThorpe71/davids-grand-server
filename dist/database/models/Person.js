import mongoose from 'mongoose';
import mongodbErrorHandler from 'mongoose-mongodb-errors';

mongoose.Promise = global.Promise;
const { Schema } = mongoose;

const personSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  name: String,
  age: Number,
  eyeColor: { type: Schema.Types.ObjectId, ref: 'EyeColor' },
  gender: String,
  company: { type: Schema.Types.ObjectId, ref: 'Company' }
});

personSchema.plugin(mongodbErrorHandler);

export default mongoose.model('Person', personSchema);
