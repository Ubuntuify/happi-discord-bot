import { Client, Collection } from 'discord.js';

import { HypixelAPI } from './bin/helpers/Hypixel';
import Utility from './lib/Utility';

interface CommandStructure {
  /** ⏳ cooldowns */
  Cooldowns: Collection<string, Collection<string, number>>;

  /** 💫 commands */
  Commands: Collection<string, any>;

  /** 💤 aliases */
  Aliases: Collection<string, string>;

  /** ✨ prefix */
  prefix: string;
}

export interface TokenStructure {
  /** 💫 discord api token. */
  DISCORD: string;

  /** 🍔 google programmable api key */
  GOOGLE_API?: {
    CSX: string;
    KEY: string;
  };

  /** 📌 hypixel api key. */
  HYPIXEL_API?: string;
}

interface ClientOptions {
  token: TokenStructure;
}

interface WrapperStructure {
  /** 📌 hypixel api wrapper. */
  Hypixel: HypixelAPI;
}

export default class Interface extends Client {
  public events: Collection<string, any>;
  public commands: CommandStructure;
  public utils: Utility;
  public readonly wrappers: WrapperStructure;
  public readonly clientOptions: ClientOptions;

  private validate(options: ClientOptions): void {
    if (typeof options !== 'object')
      throw new Error(`Options passed were of INVALID TYPE!`);
    if (!options.token.DISCORD)
      throw new Error(`Token was not specified inside options.`);
    this.token = options.token.DISCORD;
  }

  constructor(options: ClientOptions) {
    super({
      intents: ['GUILD_MESSAGES', 'GUILDS', 'GUILD_PRESENCES', 'GUILD_MEMBERS'],
    });
    this.events = new Collection();
    this.commands = {
      /** ⏳ cooldowns */
      Cooldowns: new Collection(),

      /** 💫 commands */
      Commands: new Collection(),

      /** 💤 aliases */
      Aliases: new Collection(),

      /** ✨ prefix */
      prefix: 'string',
    };
    this.wrappers = {
      Hypixel: new HypixelAPI(options.token.HYPIXEL_API),
    };
    this.clientOptions = options;
  }

  public init(): void {
    this.validate(this.clientOptions);
    super.login(this.clientOptions.token.DISCORD);
    this.utils = new Utility(this);

    /** 🔨 loading events, commands. */
    this.utils.loadEvents();
    this.utils.loadCommands();
  }
}
