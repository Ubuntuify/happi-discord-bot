import mongoose, { Mongoose } from 'mongoose';
import { mongoPath } from '../../app/config/main_config.json';

export const ReadyState = {
  0: 'Disconnected',
  1: 'Connected',
  2: 'Connecting',
  3: 'Disconnecting',
};

export default async (): Promise<Mongoose> => {
  await mongoose.connect(mongoPath, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  return mongoose;
};
