/* 🤖📚 Libraries */
import { Client, Collection } from 'discord.js';
import * as colors from 'chalk';

import { HypixelAPI } from './bin/wrappers/Hypixel';
import api from './app/config/api.json';

interface clientOptions {
  token: string;
}

export class Interface extends Client {
  events: Collection<any, any>;
  commands: any;
  wrappers: Object;

  /**
   * 📌 The primary class to be used for all the features of the bot.
   * @param {Object} options - Options to be passed to the constructor (and discord.js).
   */
  constructor(options: clientOptions) {
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
      hypixel: new HypixelAPI(api.hypixel),
    };

    // This starts the client itself.
    this.init(options);
  }

  init(options: any) {
    /* ✨ The start up for the discord wrapper. */
    this.validate(options);

    super.login((options.token = this.token));
    console.log('📡 Inserted token into discord wrapper.\n');

    /* 👓 Start of starting other functions. */

    const Utility = require('./lib/Utility').default;
    const utility = new Utility(this);

    utility.loadEvents();
    utility.loadCommands();
  }

  validate(options: any) {
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
}
