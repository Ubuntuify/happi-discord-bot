/* eslint-disable no-use-before-define */
const { MessageEmbed } = require('discord.js');
const Command = require('../../Command');

const QueryError = new MessageEmbed().setDescription(
  [
    `You did not use the command properly. Please try again with proper syntax.`,
  ].join('\n')
);

module.exports = class HypixelAPICommand extends Command {
  constructor(client, name) {
    super(client, name, {
      description: 'Gets Hypixel stats through their API.',
      category: 'Info',
      args: false,
      timing: 15,
    });
  }

  async run(message, args) {
    /* 
    To make this command more user friendly.
    I have seperated the commands to categories.

    player: player <username> | <username> <minigame>
    guild: guild <guild>
    watchdog: watchdog
    */
    if (!args[0]) return message.channel.send(QueryError);

    if (args[0].toLowerCase() === 'player') {
      if (args[2]) {
        // TODO: make this command have minigame functionality.

        if (
          args[2].toLowerCase() === 'bedwars' ||
          args[2].toLowerCase() === 'bedwar'
        ) {
          message.channel.send(
            await this.client.wrappers.hypixel.createEmbedPlayerBedwars(args[2])
          );
        }

        return;
      }

      if (!args[1]) return message.channel.send(QueryError);

      return message.channel.send(
        await this.client.wrappers.hypixel.createEmbedPlayer(args[1])
      );
    }

    if (args[0].toLowerCase() === 'guild') {
      if (!args[1]) return message.channel.send(QueryError);

      return message.channel.send(
        await this.client.wrappers.hypixel.createEmbedPlayer(args[1])
      );
    }

    if (args[0].toLowerCase() === 'watchdog') {
      return message.channel.send(
        await this.client.wrappers.hypixel.createEmbedWatchdog()
      );
    }

    message.channel.send(
      'Could not process request. Maybe, check what is your first argument.'
    );
  }
};