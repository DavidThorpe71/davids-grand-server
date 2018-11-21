import mongoose from 'mongoose';
import mongodbErrorHandler from 'mongoose-mongodb-errors';

mongoose.Promise = global.Promise;
const { Schema } = mongoose;

const eyeColorSchema = new Schema(
  {
    color: String
  },
  { timestamps: true }
);

eyeColorSchema.plugin(mongodbErrorHandler);

export default mongoose.model('EyeColor', eyeColorSchema);
