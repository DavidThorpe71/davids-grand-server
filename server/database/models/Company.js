import mongoose from 'mongoose';
import mongodbErrorHandler from 'mongoose-mongodb-errors';

mongoose.Promise = global.Promise;
const { Schema } = mongoose;

const companySchema = new Schema(
  {
    name: String
  },
  { timestamps: true }
);

companySchema.plugin(mongodbErrorHandler);

export default mongoose.model('Company', companySchema);
