import { model, Schema } from 'mongoose';

const prefixSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    required: true,
  },
});

export default model('guild.prefix', prefixSchema);
