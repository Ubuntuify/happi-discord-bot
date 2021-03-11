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

/** 💦 Command prefix scheme model. */
export default model('guild-prefixes', Schema);
