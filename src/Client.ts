/* 🤖📚 Libraries */
/* eslint-disable no-use-before-define */
import { Client, Collection } from 'discord.js';
import colors from 'chalk';

import { HypixelAPI } from './bin/wrappers/Hypixel';
import config from './app/config/main_config.json';
import api from './app/config/api.json';

export class Interface extends Client {
  public events: Collection<any, any>;
  public commands: CommandCollections;
  public wrappers: WrapperObject;

  /**
   * 📌 The primary class to be used for all the features of the bot.
   * @param options - Options to be passed to the constructor (and discord.js).
   */
  constructor(options: ClientOptions) {
    super({
      disableMentions: 'everyone',
    });

    // These load the 📡 events and 💻 commands collections.
    this.events = new Collection();
    this.commands = {
      Cooldowns: new Collection(),
      Commands: new Collection(),
      Aliases: new Collection(),
      prefix: config.prefix,
    };
    this.wrappers = {
      Hypixel: new HypixelAPI(api.hypixel),
    };

    // This starts the client itself.
    this.init(options);
  }

  public init(options: ClientOptions): void {
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

  private validate(options: any): void {
    if (typeof options !== 'object')
      throw new TypeError(`${colors.red('✖ ')} Options must be an object.`);

    if (!options.token)
      throw new Error(`${colors.red('✖ ')} You did not provide a token.`);
    this.token = options.token;

    console.log('🏁 Completed verification of provided options.');
  }

  /* eslint-disable-next-line class-methods-use-this */
  public exit(): void {
    // ✨ This method will exit the process.
    console.log(`\n✨ Exiting client.. Goodbye!`);
    process.exit(0);
  }
}

/**
 * Options to be passed on to the Client instance.
 */
interface ClientOptions {
  token: string;
}

/**
 * The object that represents the wrappers inside the client.
 */
interface WrapperObject {
  Hypixel: HypixelAPI;
}

/**
 * The collections required for the command handler.
 */
interface CommandCollections {
  Cooldowns: Collection<any, any>;
  Commands: Collection<any, any>;
  Aliases: Collection<any, any>;
  prefix: string;
}
