import { red, yellow } from 'chalk';
import { Message } from 'discord.js';
import ora from 'ora';
import ms from '../../../bin/functions/ms/ms';
import Event from '../Event';

module.exports = class MessageEvent extends Event {
  public async run(message: Message): Promise<void> {
    const mentionRegex: RegExp = RegExp(`^<@!${this.client.user.id}>$`);
    const mentionRegexPrefix: RegExp = RegExp(`^<@!${this.client.user.id}> `);

    if (!message.guild || message.author.bot) return;

    if (message.content.match(mentionRegex)) {
      message.channel.send(
        `My prefix for ${message.guild.name} is \`${this.client.commands.prefix}\`.`
      );
    }

    const prefix = message.content.match(mentionRegexPrefix)
      ? message.content.match(mentionRegexPrefix)[0]
      : this.client.commands.prefix;

    /* eslint-disable-next-line prettier/prettier */
    const [cmd, ...args] = 
      message.content.slice(prefix.length).trim().split(/ +/g);

    const command =
      this.client.commands.Commands.get(cmd.toLowerCase()) ||
      this.client.commands.Commands.get(
        this.client.commands.Aliases.get(cmd.toLowerCase())
      );

    if (command) {
      this.runCommand(command, { message, args });
    }
  }

  /* eslint-disable-next-line class-methods-use-this */
  private async runCommand(
    command,
    { message, args }: { message: Message; args: string[] }
  ): Promise<void> {
    const loadingSpinner = ora().start(
      `Request ${red(command.name)} from ${yellow(
        message.author.username
      )} is being accomplished`
    );

    try {
      command.run(message, args);

      loadingSpinner.succeed(
        `Request ${red(command.name)} from ${yellow(
          message.author.username
        )} took ${ms(message.createdTimestamp - Date.now(), {
          long: true,
        })}`
      );
    } catch (error) {
      message.channel.send(
        '\\❌ Wow! An error occured. Please notify the owner.'
      );
    }
  }
};
