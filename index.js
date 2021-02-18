/* eslint-disable no-unused-vars */

/* 🤖📚 Libraries */
const Interface = require('./src/Client.js');
const token = require('./src/app/config/api.json');

/* ✨ Initializes discord and other api wrappers. */
const Client = new Interface({ token: token.discord });
