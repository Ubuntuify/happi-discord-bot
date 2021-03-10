import mongoose, { Mongoose } from 'mongoose';
import { mongoPath } from '../../app/config/main_config.json';

export default async (): Promise<Mongoose> => {
  await mongoose.connect(mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  });
  return mongoose;
};
