/* eslint-disable no-unused-vars */

/* 🤖📚 Libraries */
import token from './src/app/config/api.json';

import { Interface } from './src/Client';

/* ✨ Initializes discord and other api wrappers. */
const Client = new Interface({ token: token.discord });
