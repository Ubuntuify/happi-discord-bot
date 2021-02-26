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
    /* 📚 Uses the ora library to make a loading screen. */
    const loadingSpinner = ora().start(
      `Request ${red(command.name)} from ${yellow(
        message.author.username
      )} is being accomplished`
    );

    /* ✅ Executes whether args is required and args aren't provided. */
    if (command.args && !args.length) {
      const MessageError =
        '\\💫 You did not specify arguments for a command that requires arguments.';

      message.channel.send(MessageError);
      return;
    }

    try {
      command.run(message, args);

      /* ✔ Informs the console that the command suceeded. */
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

      /* ❌ Informs the console that the command failed. */
      loadingSpinner.fail(
        `Request ${red(command.name)} that took ${ms(
          message.createdTimestamp - Date.now(),
          { long: true }
        )} resulted in an exception.`
      );
    }
  }
};
