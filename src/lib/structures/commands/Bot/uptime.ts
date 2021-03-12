/* eslint-disable class-methods-use-this */

import { Message } from 'discord.js';
import ms from 'ms';

import BaseCommand from '../../Command';
import Client from '../../../../Client';

module.exports = class extends BaseCommand {
  /* 💔 Passes options to main class. */
  constructor(client: Client, name: string) {
    super(client, name, {
      cooldown: 10,
      aliases: [],
      args: false,
      category: 'BOT',
    });
  }

  /* 📡 This runs when the command is run. */
  public async run(message: Message): Promise<void> {
    /* 💫 uptime code here. */
    const uptime = ms(this.client.uptime, { long: true });
    message.reply(`I've been running for ${uptime}!`);
  }
};
