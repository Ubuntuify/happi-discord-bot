import { model, Schema as Scheme } from 'mongoose';

const Schema = new Scheme({
  _id: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    required: true,
  },
});

export default model('guild-prefixes', Schema);
