/* eslint-disable class-methods-use-this */

import { Message } from 'discord.js';
import BaseCommand from '../../Command';
import Client from '../../../../Client';

module.exports = class extends BaseCommand {
  /* 💔 Passes options to main class. */
  constructor(client: Client, name: string) {
    super(client, name, {
      cooldown: 30,
      category: 'Hypixel',
      aliases: [],
      args: true,
    });
  }

  /* 📡 This runs when the command is run. */
  public async run(message: Message, args: string[]): Promise<void> {
    /* 💫 sample code here. */
    message.channel.send(
      await this.client.wrappers.Hypixel.createEmbedPlayerUHC(args.join(' '))
    );
  }
};
