import { bold, green, yellow } from 'chalk';
import { Client, Collection } from 'discord.js';
import Listr from 'listr';

import { HypixelAPI } from './bin/helpers/Hypixel/Hypixel';
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
  prefix: string;
  mongo: any;
}

interface WrapperStructure {
  /** 📌 hypixel api wrapper. */
  Hypixel: HypixelAPI;
}

export default class Interface extends Client {
  public events: Collection<string, any>;
  public commands: CommandStructure;
  public utils: Utility;
  public db: any;

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
      intents: [
        'GUILD_MESSAGES',
        'GUILDS',
        'GUILD_PRESENCES',
        'GUILD_MEMBERS',
        'GUILD_MESSAGE_REACTIONS',
        'GUILD_VOICE_STATES',
      ],
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
      prefix: options.prefix,
    };
    this.wrappers = {
      Hypixel: new HypixelAPI(options.token.HYPIXEL_API),
    };
    this.clientOptions = options;
    this.db = options.mongo;
  }

  public init(): void {
    this.utils = new Utility(this);
    const tasks = new Listr([
      {
        title: 'Initializing Discord Bot..',
        task: () => {
          return new Listr([
            {
              title: 'Validating provided options.',
              task: () => this.validate(this.clientOptions),
            },
            {
              title: yellow('Loading event classes.'),
              task: () => this.utils.loadEvents(),
            },
            {
              title: green('Loading command classes.'),
              task: () => this.utils.loadCommands(),
            },
            {
              title: bold('Connecting to Discord API.'),
              task: () => super.login(this.clientOptions.token.DISCORD),
            },
          ]);
        },
      },
    ]);

    tasks.run().catch((err) => console.error(err));
  }
}
