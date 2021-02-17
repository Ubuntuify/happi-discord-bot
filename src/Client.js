/* 🤖📚 Libraries */
const { Client, Collection } = require('discord.js');
const colors = require('colors/safe');
const path = require('path');

// eslint-disable-next-line import/no-dynamic-require
const api = require(`${path.dirname(
  require.main.filename
)}/src/app/config/api.json`);

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

    // These load the 📡 events and 💻 commands collections.
    this.events = new Collection();
    this.commands = {
      timings: new Collection(),
      commands: new Collection(),
      aliases: new Collection(),
    };
    this.wrappers = {
      hypixel: new Hypixel(api.hypixel),
    };

    // This starts the client itself.
    this.init(options);
  }

  init(options) {
    /* ✨ The start up for the discord wrapper. */
    this.validate(options);

    super.login((options.token = this.token));
    console.log('📡 Inserted token into discord wrapper.\n');

    /* 👓 Start of starting other functions. */

    delete require.cache;

    // eslint-disable-next-line global-require
    const Utility = require('./lib/Utility.js');
    const utility = new Utility(this);

    utility.loadEvents();
    utility.loadCommands();
  }

  validate(options) {
    if (typeof options !== 'object')
      throw new TypeError(`${colors.red('✖ ')} Options must be an object.`);

    if (!options.token)
      throw new Error(`${colors.red('✖ ')} You did not provide a token.`);
    this.token = options.token;

    console.log('🏁 Completed verification of provided options.');
  }

  static exit() {
    // ✨ This method will exit the process.
    console.log(`\n✨ Exiting client.. Goodbye!`);
    process.exit(0);
  }
};
