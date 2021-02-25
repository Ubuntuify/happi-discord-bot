import Discord from 'discord.js';
import * as Client from '../../Client';

/**
 * The options that defines what the commands are about.
 */
export interface CommandOptions {
  category?: string;
  name?: string;
  usage?: string;
  description?: string;
  ownerOnly?: boolean;
  timing: number;
  aliases: string[];
  args: boolean;
}

export default abstract class BaseCommand {
  /* 📚 The properties of this class */
  client: Client.Interface;
  name: string;
  aliases: string[];
  category: string;
  args: boolean;
  usage: string;
  description: string;
  cooldown: number;
  ownerOnly: boolean;

  /* 🔨 The constructor for this class. */
  constructor(client: Client.Interface, name: string, options: CommandOptions) {
    /* ✨ Important parts of the command class. */
    this.client = client;
    this.name = options.name || name;

    /* 💫 Not essential but required components of this abstract class. */
    this.aliases = options.aliases;
    this.cooldown = options.timing;
    this.args = options.args;

    /* 💤 Optional parts of this abstract class. */
    this.category = options.category || 'Misc.';
    this.description = options.description;
    this.usage =
      options.usage ||
      'Usage guide was not provided. Contact the author for a fix.';

    this.ownerOnly = options.ownerOnly || false;
  }

  /* eslint-disable-next-line */
  public async run(message: Discord.Message, args: string[]): Promise<void> {
    throw new Error('This run method was not implemented successfully.');
  }
}
