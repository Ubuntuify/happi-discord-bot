import { Collection, Message, MessageEmbed } from 'discord.js';
import { readFileSync } from 'fs';

import Utility from '../../../Utility';
import BaseCommand from '../../Command';
import Event from '../../Event';
import { permissions } from '../../../../app/config/main_config.json';

module.exports = class extends Event {
  public async run(message: Message): Promise<void> {
    const mentionRegex: RegExp = RegExp(`^<@!${this.client.user.id}>$`);
    const mentionRegexPrefix: RegExp = RegExp(`^<@!${this.client.user.id}> `);

    if (!message.guild || message.author.bot) return;

    const { directory } = Utility.prototype;
    const guildSettings = JSON.parse(
      readFileSync(`${directory}/src/srv/guild.json`, { encoding: 'utf-8' })
    );
    const prefix = message.content.match(mentionRegexPrefix)
      ? message.content.match(mentionRegexPrefix)[0]
      : guildSettings[message.guild.id].prefix || this.client.commands.prefix;

    if (message.content.match(mentionRegex)) {
      message.reply(`My prefix for ${message.guild.name} is \`${prefix}\`.`);
    }

    /* eslint-disable-next-line prettier/prettier */
    const [cmd, ...args] =
      message.content.slice(prefix.length).trim().split(/ +/g);

    const command =
      this.client.commands.Commands.get(cmd.toLowerCase()) ||
      this.client.commands.Commands.get(
        this.client.commands.Aliases.get(cmd.toLowerCase())
      );

    if (command && message.content.startsWith(prefix)) {
      this.runCommand(command, { message, args });
    }
  }

  private async runCommand(
    command: any,
    { message, args }: { message: Message; args: string[] }
  ): Promise<void> {
    /* ✅ Executes whether args is required and args aren't provided. */
    if (command.args && !args.length) {
      const MessageError =
        '\\💫 You did not specify arguments for a command that requires arguments.';
      message.reply(MessageError);
      return;
    }

    /* 💫 Checks for permissions from the main config. */
    const allpermissions = permissions.all.id;
    if (allpermissions.indexOf(message.author.id) <= -1 && command.ownerOnly)
      return;

    /* 🎉 Handles cooldowns. */
    if (!(await this.handleCooldowns(command, message))) return;

    /* 🎉 Starts to run the command. */
    try {
      message.channel.startTyping(1);
      await command.run(message, args);
    } catch (err) {
      message.reply('Error occured at command runtime.');
      console.error(err);
    } finally {
      message.channel.stopTyping();
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
        const messageSent = await message.reply(
          '💫 Waiting for error response...'
        );

        const {
          choices,
        } = require('../../../../app/config/message.json').error.cooldown;
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
    setTimeout(async () => {
      time_stamps.delete(message.author.id);
    }, cooldown_amount);

    return true;
  }
};
