import { Collection, Message, MessageEmbed } from 'discord.js';
import PrefixSchema from '../../../../schema/command-prefix-schema';
import Event from '../../Event';
import Command from '../../Command';
import Client from '../../../../Client';

interface CommandStartup {
  _command: {
    command: any;
    cmd: string;
    args: string[];
  };
  message: Message;
}

async function getPrefix(_id: string, client: Client): Promise<any> {
  const PrefixMongoose: any = await PrefixSchema.findOne({ _id });

  const prefix =
    PrefixMongoose == null ? client.commands.prefix : PrefixMongoose.prefix;
  return prefix;
}

module.exports = class extends Event {
  public async run(message: Message): Promise<void> {
    const mentionRegex = RegExp(`^<@!${this.client.user.id}>$`);
    const mentionRegexPrefix = RegExp(`^<@!${this.client.user.id}> `);

    if (!message.guild || message.author.bot) return;
    const Prefix = message.content.match(mentionRegexPrefix)
      ? message.content.match(mentionRegexPrefix)[0]
      : await getPrefix(message.guild.id, this.client);

    if (message.content.match(mentionRegex))
      message.reply(
        `My prefix for \`${message.guild.name}\` is currently \`${Prefix}\``
      );
    const [cmd, ...args] = message.content
      .slice(Prefix.length)
      .trim()
      .split(/ +/g);

    const { Commands, Aliases } = this.client.commands;
    const commandName = Commands.has(cmd.toLowerCase())
      ? cmd.toLowerCase()
      : Aliases.get(cmd.toLowerCase());

    if (Commands.has(commandName) && message.content.startsWith(Prefix)) {
      this.executeCommand({
        _command: {
          command: Commands.get(commandName),
          cmd,
          args,
        },
        message,
      });
    }
  }

  async executeCommand({ _command, message }: CommandStartup) {
    const { Cooldowns } = this.client.commands;

    const command = await _command.command;
    const { args } = _command;

    if (command.args && !args.length)
      return message.reply(`\\💫 Missing arguments.`);

    const { name, cooldown, ownerOnly }: Command = await command;

    if (ownerOnly && message.author.id !== '323047832317591552') return;

    if (!Cooldowns.has(name)) Cooldowns.set(name, new Collection());
    const currentTime = Date.now();
    const timeStamps = Cooldowns.get(name);
    const cooldownAmount = cooldown * 1000;

    if (timeStamps.has(message.author.id)) {
      const expirationTime = timeStamps.get(message.author.id) + cooldownAmount;
      if (currentTime >= expirationTime) {
        const timeLeft = (expirationTime - currentTime) / 1000;
        const embed = new MessageEmbed().setTitle('\\💫 Error').setDescription(
          /* eslint-disable-next-line prettier/prettier */
          `Please wait for \`${timeLeft.toFixed(1)}\` more seconds before using ${name} again!`
        );
        message.reply(embed);
        return;
      }
    }

    try {
      timeStamps.set(message.author.id, currentTime);
      setTimeout(async () => {
        timeStamps.delete(message.author.id);
      }, cooldownAmount);
      message.channel.startTyping();
      await command.run(message, args);
    } catch (err) {
      console.error(err);
      message.reply('\\💥 Unhandled exception detected. Whoops!');
    } finally {
      message.channel.stopTyping();
    }
  }
};
