/* eslint-disable no-unused-vars */

/* 🤖📚 Libraries */
const colors = require('colors/safe');

const Interface = require('./src/Client.js');
const token = require('./apikeys.json');

console.log(`🔹 Index file ${colors.red('imported libraries.')}`);

/* ✨ Initializes discord and other api wrappers. */
const Client = new Interface({ token: token.discord });

console.log(`🔹 Index file ${colors.green('finished running')}.`);
console.log();
