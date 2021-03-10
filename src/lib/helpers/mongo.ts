import mongoose from 'mongoose';
import { mongoPath } from '../../app/config/main_config.json';

export default async (): Promise<any> => {
  await mongoose.connect(mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return mongoose;
};
