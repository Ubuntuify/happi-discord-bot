/* 🤖📚 Libraries */
const { Client, Collection } = require('discord.js');
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

    this.events = new Collection();
    this.wrappers = {
      hypixel: new Hypixel(keys.hypixel),
    };
    this.init(options);
  }

  init(options) {
    /* ✨ The start up for the discord wrapper. */
    this.validate(options);
    this.discordLogin(options.token);

    console.log();

    /* 👓 Start of starting other functions. */
    // eslint-disable-next-line global-require
    const Utility = require('./lib/Utility.js');
    const utility = new Utility(this);

    utility.loadEvents();
  }

  validate(options) {
    if (typeof options !== 'object')
      throw new TypeError(`${colors.red('✖ ')} Options must be an object.`);

    if (!options.token)
      throw new Error(`${colors.red('✖ ')} You did not provide a token.`);
    this.token = options.token;

    console.log('🏁 Completed verification of provided options.');
  }

  async discordLogin(token = this.token) {
    super.login(token);
    console.log('📡 Inserted token into discord wrapper.');
  }
};
