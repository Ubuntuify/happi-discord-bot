import { Message } from 'discord.js';
import BaseCommand from '../../Command';
import Client from '../../../../Client';

module.exports = class extends BaseCommand {
  constructor(client: Client, name: string) {
    super(client, name, {
      cooldown: 10,
      aliases: [],
      args: false,
    });
  }

  public async run(message: Message): Promise<void> {
    if (!message.member.voice.channel) {
      message.reply('\\❌ You are not in a voice channel.');
      return;
    }

    const voicePerms = message.member.voice.channel.permissionsFor(
      this.client.user
    );
    if (!(voicePerms.has('CONNECT') || voicePerms.has('SPEAK'))) {
      return super.returnError(message, 'INTERNAL_ERROR');
    }

    await message.member.voice.channel
      .join()
      .then(({ channel }) =>
        message.reply(`\\🔊 Joined voice channel with id \`${channel.id}\`.`)
      );
  }
};
