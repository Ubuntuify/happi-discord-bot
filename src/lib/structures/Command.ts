import Discord from 'discord.js';
import Client from '../../Client';

/**
 * The options that defines what the commands are about.
 */
export interface CommandOptions {
  category?: string;
  name?: string;
  usage?: string;
  description?: string;
  ownerOnly?: boolean;
  cooldown?: number;
  aliases: string[];
  args: boolean;
}

export default abstract class BaseCommand {
  /* 📚 The properties of this class */
  public client: Client;
  public name: string;
  public aliases: string[];
  public category: string;
  public args: boolean;
  public usage: string;
  public description: string;
  public cooldown: number;
  public ownerOnly: boolean;

  /* 🔨 The constructor for this class. */
  constructor(client: Client, name: string, options: CommandOptions) {
    /* ✨ Important parts of the command class. */
    this.client = client;
    this.name = options.name || name;

    /* 💫 Not essential but required components of this abstract class. */
    this.aliases = options.aliases;
    this.cooldown = options.cooldown ?? 5;
    this.args = options.args;

    /* 💤 Optional parts of this abstract class. */
    this.category = options.category || 'Misc';
    this.description =
      options.description ??
      'Description was not provided. Contact the owner for a fix.\n(Or make a pull request.)';
    this.usage =
      options.usage ||
      'Usage guide was not provided. Contact the author for a fix.\n(Or make a pull request.)';

    this.ownerOnly = options.ownerOnly ?? false;
  }

  /* eslint-disable-next-line */
  public async run(message: Discord.Message, args: string[]): Promise<void> {
    throw new Error('This run method was not implemented successfully.');
  }

  /* eslint-disable-next-line */
  async returnError(message: Discord.Message, errorCode: BitStringError): Promise<void> {
    message.channel.send(
      `We had an error while processing your request. \`${errorCode}\``
    );
  }
}

type BitStringError = 'NO_PERMISSION' | 'INTERNAL_ERROR' | 'INVALID_ARGS';
