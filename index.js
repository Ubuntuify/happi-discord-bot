/* eslint-disable no-unused-vars */

/* 🤖📚 Libraries */
const colors = require('colors/safe');

const Interface = require('./src/Client.js');
const token = require('./API_KEYS.json');

/* ✨ Initializes discord and other api wrappers. */
const Client = new Interface({ token: token.discord });
