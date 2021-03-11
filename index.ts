/* eslint-disable no-unused-vars */
import { readFileSync } from 'fs';
import Interface, { TokenStructure } from './src/Client';
import Mongoose from './src/lib/helpers/mongo';

const APIKeys: TokenStructure = JSON.parse(
  readFileSync('./src/app/config/api.json', { encoding: 'utf-8' })
);

/* ✨ Initializes discord and other api wrappers. */
const Client = new Interface({
  token: APIKeys,
  mongo: Mongoose(),
  prefix: '!',
});

Client.init();
