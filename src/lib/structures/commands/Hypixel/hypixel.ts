/* eslint-disable no-use-before-define */
import { MessageEmbed, Message } from 'discord.js';
import { Interface } from '../../../../Client';

const Command = require('../../Command').default;

const QueryError = new MessageEmbed().setDescription(
  [
    `You did not use the command properly. Please try again with proper syntax.`,
  ].join('\n')
);

module.exports = class HypixelAPICommand extends Command {
  constructor(client: Interface, name: string) {
    super(client, name, {
      description: 'Gets Hypixel stats through their API.',
      category: 'Hypixel',
      args: false,
      timing: 15,
    });
  }

  async run(message: Message, args: string[]) {
    /*
        To make this command more user friendly.
        I have seperated the commands to categories.

        player: player <username> | <username> <minigame>
        guild: guild <guild>
        watchdog: watchdog
    */
    if (!args[0]) return message.channel.send(QueryError);

    if (args[0].toLowerCase() === 'player' && args[1]) {
      if (args[2]) {
        // TODO: make this command have minigame functionality.
        const mode = args[2].toLowerCase();

        if (mode.match(/^(bedwars|bedwar)$/)) {
          message.channel.send(
            await this.client.wrappers.hypixel.createEmbedPlayerBedwars(args[1])
          );
        }

        if (mode.match(/^(skywars|skywar)$/)) {
          message.channel.send(
            await this.client.wrappers.hypixel.createEmbedPlayerSkywars(args[1])
          );
        }
        return;
      }
      return message.channel.send(
        await this.client.wrappers.hypixel.createEmbedPlayer(args[1])
      );
    }

    if (args[0].toLowerCase() === 'guild' && args[1]) {
      return message.channel.send(
        await this.client.wrappers.hypixel.createEmbedPlayer(args[1])
      );
    }

    if (args[0].toLowerCase() === 'watchdog') {
      return message.channel.send(
        await this.client.wrappers.hypixel.createEmbedWatchdog()
      );
    }

    message.channel.send(QueryError);
  }
};
