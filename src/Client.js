/* 🤖📚 Libraries */
const { Client } = require('discord.js');
const colors = require('colors/safe');
const path = require('path');

// eslint-disable-next-line import/no-dynamic-require
const keys = require(`${path.dirname(require.main.filename)}/apikeys.json`);
const Hypixel = require('./bin/wrappers/Hypixel.js');

module.exports = class Interface extends Client {
  /**
   * 📌 The primary class to be used for all the features of the bot.
   * @param {Object} options - Options to be passed to the constructor (and discord.js).
   */
  constructor(options = {}) {
    super({
      disableMentions: 'everyone',
    });

    this.init(options);
    this.once('ready', () => {
      console.log(
        // eslint-disable-next-line prettier/prettier
        `🤖 🟢 Discord API is now online as${colors.yellow(this.user.username)}.`
      );
    });
  }

  init(options) {
    /* ✨ The start up for the discord wrapper. */
    this.validate(options);
    this.discordLogin(options.token);

    /* 👓 Start of starting other functions. */
    this.api = {
      hypixel: new Hypixel(keys.hypixel),
    };
  }

  validate(options) {
    if (typeof options !== 'object')
      throw new TypeError(`${colors.red('✖ ')} Options must be an object.`);

    if (!options.token)
      throw new Error(`${colors.red('✖ ')} You did not provide a token.`);
    this.token = options.token;

    console.log('Completed verification of provided options.');
  }

  async discordLogin(token = this.token) {
    super.login(token);
    console.log('Inserted token into discord wrapper.');
  }
};

function getWrappers() {
  const wrapperPath = './bin/wrappers';

  // TODO: Check how many API wrappers exist.
}
