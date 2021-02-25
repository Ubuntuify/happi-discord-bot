/* eslint-disable class-methods-use-this */

import { Message, MessageEmbed } from 'discord.js';
import BaseCommand from '../../Command';
import * as Client from '../../../../Client';

module.exports = class PingCommand extends BaseCommand {
  /* 💔 Passes options to main class. */
  constructor(client: Client.Interface, name: string) {
    super(client, name, {
      category: 'Bot',
      timing: 10,
      aliases: [],
      description: 'Gets ping information from wrappers.',
      args: false,
    });
  }

  /* 📡 This runs when the command is run. */
  public async run(message: Message): Promise<void> {
    /* 💫 gets all the ping. */
    message.channel.send(
      new MessageEmbed().setTitle('\\💫 Ping').addFields(
        {
          name: 'Websocket Ping',
          value: await this.client.ws.ping,
          inline: true,
        },
        {
          name: 'Calculated Ping',
          value: await (Date.now() - message.createdTimestamp),
          inline: true,
        },
        {
          name: 'Hypixel Ping',
          value: await this.client.wrappers.Hypixel.getPing(),
          inline: true,
        }
      )
    );
  }
};
