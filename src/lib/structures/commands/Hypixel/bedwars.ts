/* eslint-disable no-use-before-define */
import { MessageEmbed, Message } from 'discord.js';
import { Interface } from '../../../../Client';

const Command = require('../../Command').default;

const QueryError = new MessageEmbed().setDescription(
  [
    `You did not use the command properly. Please try again with proper syntax.`,
  ].join('\n')
);

module.exports = class BedwarsCommand extends Command {
  constructor(client: Interface, name: string) {
    super(client, name, {
      description: 'Gets Hypixel Bedwars stats through their API.',
      aliases: ['bw', 'bedwar'],
      category: 'Hypixel',
      args: false,
      timing: 15,
    });
  }

  async run(message: Message, args: string[]) {
    if (args[0]) {
      message.channel.send(
        await this.client.wrappers.hypixel.createEmbedPlayerBedwars(args[0])
      );
      return;
    }

    message.channel.send(QueryError);
  }
};
