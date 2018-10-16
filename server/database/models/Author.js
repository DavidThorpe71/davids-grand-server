import mongoose from 'mongoose';

const { Schema } = mongoose;

const authorSchema = new Schema({
  name: String
});

export default mongoose.model('Author', authorSchema);
