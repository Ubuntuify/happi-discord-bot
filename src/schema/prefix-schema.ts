import { model, Schema } from 'mongoose';

const prefixSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  prefix: String,
});

export default model('prefix', prefixSchema);
