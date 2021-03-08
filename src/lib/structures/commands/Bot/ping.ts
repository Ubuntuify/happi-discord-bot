/* eslint-disable class-methods-use-this */

import { Message, MessageEmbed } from 'discord.js';
import BaseCommand from '../../Command';
import Client from '../../../../Client';

module.exports = class extends BaseCommand {
  /* 💔 Passes options to main class. */
  constructor(client: Client, name: string) {
    super(client, name, {
      category: 'Bot',
      cooldown: 15,
      aliases: ['pong'],
      description: 'Gets ping information from numerous sources.',
      args: false,
    });
  }

  /* 📡 This runs when the command is run. */
  public async run(message: Message): Promise<void> {
    /* 💫 gets all the ping. */
    const msg = await message.channel.send('\\✨ Pinging...');

    const choices = [
      "I don't want to know my results!",
      'My ping better be good!',
      'I heard the longer it takes, the worst it gets.',
      "I know I'm not meant to feel. But this is scary!",
      'I~~---~~ cuttin~~---~~ **OUT!**',
    ];
    const pickedChoice = choices[Math.floor(Math.random() * choices.length)];

    const internalLatency = msg.createdTimestamp - message.createdTimestamp;
    const generatedEmbed = new MessageEmbed()
      .setTitle('\\💫 Ping')
      .setDescription(pickedChoice)
      .addFields(
        {
          name: 'Websocket Ping',
          value: this.client.ws.ping,
          inline: true,
        },
        {
          name: 'Calculated Ping',
          value: message.createdTimestamp - Date.now(),
          inline: true,
        },
        {
          name: 'Internal Latency',
          value: internalLatency,
          inline: true,
        },
        {
          name: 'Hypixel Ping',
          value: await this.client.wrappers.Hypixel.getPing(),
          inline: true,
        }
      );
    msg.edit('** **', generatedEmbed);
  }
};
