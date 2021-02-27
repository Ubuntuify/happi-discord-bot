import { red, yellow } from 'chalk';
import { Collection, Message, MessageEmbed } from 'discord.js';
import ora from 'ora';
import ms from 'ms';

import BaseCommand from '../../Command';
import Event from '../../Event';
import { permissions } from '../../../../app/config/main-config.json';

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
    command: any,
    { message, args }: { message: Message; args: string[] }
  ): Promise<void> {
    /* ✅ Executes whether args is required and args aren't provided. */
    if (command.args && !args.length) {
      const MessageError =
        '\\💫 You did not specify arguments for a command that requires arguments.';
      message.channel.send(MessageError);
      return;
    }

    /* 📚 Uses the ora library to make a loading screen. */
    const loadingSpinner = ora().start(
      `Request ${red(command.name)} from ${yellow(
        message.author.username
      )} is being accomplished`
    );

    /* 💫 Checks for permissions from the main config. */
    const allpermissions = permissions.all.id;
    if (allpermissions.indexOf(message.author.id) <= -1 && command.ownerOnly) {
      loadingSpinner.fail(
        `Attempted access into ${red(command.name)} by ${yellow(
          message.author.username
        )}`
      );
      return;
    }

    /* 🎉 Handles cooldowns. */
    if (!(await this.handleCooldowns(command, message))) {
      loadingSpinner.warn(
        `${yellow(
          message.author.username
        )} did not wait for his cooldown of ${red(command.name)}`
      );
      return;
    }

    /* 🎉 Starts to run the command. */
    try {
      await command.run(message, args);

      /* 💫 Informs the console that the command suceeded. */
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
  } /* eslint-disable camelcase */

  /* eslint-disable-next-line prettier/prettier */
  private async handleCooldowns({ name, cooldown }: BaseCommand, message: Message): Promise<boolean> {
    const cooldowns = this.client.commands.Cooldowns;
    if (!cooldowns.has(name)) {
      cooldowns.set(name, new Collection());
    }

    const current_time = Date.now();
    const time_stamps: Collection<any, any> = cooldowns.get(name);
    const cooldown_amount: number = (await cooldown) * 1000;

    if (time_stamps.has(message.author.id)) {
      const expiration_time: number =
        (await time_stamps.get(message.author.id)) + cooldown_amount;

      if (current_time <= expiration_time) {
        const messageSent = await message.channel.send(
          '💫 Waiting for error response...'
        );

        const choices = [
          "Can't keep up!",
          "I'm on vacation!",
          'Slow but steady wins the race.',
        ];
        const chosen = choices[Math.floor(Math.random() * choices.length)];

        const time_left = (expiration_time - current_time) / 1000;
        const embed = new MessageEmbed()
          .setTitle('\\💫 Error')
          .setDescription(
            `${chosen} Please wait for \`${time_left.toFixed(
              1
            )}\` more seconds before using ${name} again!`
          );

        messageSent.edit('** **', embed);
        return false;
      }
    }

    time_stamps.set(message.author.id, current_time);
    return true;
  }
};
