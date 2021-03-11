import { Message, MessageEmbed } from 'discord.js';
import { readFileSync } from 'fs';
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
    const changelog = readFileSync(
      `${this.client.utils.directory}/src/app/changelog`,
      { encoding: 'utf-8' }
    );

    const embed = new MessageEmbed()
      .setTitle('\\🔄 Changelog.')
      .setDescription(`${changelog}\n\u200b`);
    message.reply(embed);
  }
};
