import { Message } from 'discord.js';
import BaseCommand from '../../Command';
import { fetchConnection } from '../../../helpers/discord/voice';
import Client from '../../../../Client';

module.exports = class extends BaseCommand {
  constructor(client: Client, name: string) {
    super(client, name, {
      cooldown: 10,
      aliases: [],
      args: false,
    });
  }

  public async run(message: Message): Promise<any> {
    if (!message.member.voice.channel) {
      message.reply('\\❌ You are not in a voice channel.');
      return;
    }

    const connection = await fetchConnection(
      this.client,
      message.member.voice.channel.id
    );

    if (!connection) {
      message.reply("\\❌ I'm not connected to your voice channel.");
    }

    connection.channel.leave();
    message.reply(
      `\\🔊 Left voice channel with id \`${connection.channel.id}\`.`
    );
  }
};
