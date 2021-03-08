import Discord, { Message, MessageEmbed } from 'discord.js';
import { utc } from 'moment';
import os from 'os';
import ms from 'ms';
import childProcess from 'child_process';
import { version, repository } from '../../../../../package.json';
import BaseCommand from '../../Command';
import Client from '../../../../Client';
import Utility from '../../../Utility';

const djsversion = Discord.version;

module.exports = class extends BaseCommand {
  constructor(client: Client, name: string) {
    super(client, name, {
      cooldown: 10,
      aliases: ['botinfo'],
      args: false,
    });
  }

  public async run(message: Message): Promise<void> {
    const core = os.cpus()[0];
    const embed = new MessageEmbed()
      .setThumbnail(this.client.user.displayAvatarURL())
      .setColor(message.guild.me.displayHexColor || 'BLUE')
      .addField('General', [
        `**❯ Client:** ${this.client.user.tag} (${this.client.user.id})`,
        `**❯ Commands:** ${this.client.commands.Commands.size}`,
        `**❯ Servers:** ${this.client.guilds.cache.size.toLocaleString()} `,
        `**❯ Users:** ${this.client.guilds.cache
          .reduce((a, b) => a + b.memberCount, 0)
          .toLocaleString()}`,
        `**❯ Channels:** ${this.client.channels.cache.size.toLocaleString()}`,
        `**❯ Creation Date:** ${utc(this.client.user.createdTimestamp).format(
          'Do MMMM YYYY HH:mm:ss'
        )}`,
        `**❯ Node.js:** ${process.version}`,
        `**❯ Version:** v${version}`,
        `**❯ Discord.js:** v${djsversion}`,
        '\u200b',
      ])
      .addField('System', [
        `**❯ Platform:** ${process.platform}`,
        `**❯ Uptime:** ${ms(os.uptime() * 1000, { long: true })}`,
        `**❯ CPU:**`,
        `\u3000 Cores: ${os.cpus().length}`,
        `\u3000 Model: ${core.model}`,
        `\u3000 Speed: ${core.speed}MHz`,
        `**❯ Memory:**`,
        `\u3000 Total: ${Utility.prototype.formatBytes(
          process.memoryUsage().heapTotal
        )}`,
        `\u3000 Used: ${Utility.prototype.formatBytes(
          process.memoryUsage().heapUsed
        )}`,
        '\u200b',
      ])
      .addField('Git', [
        `**❯ Hash:** ${childProcess
          .execSync('git rev-parse HEAD')
          .toString()
          .trim()
          .slice(0, 7)}`,
        `**❯ Repository:** [Link to GitHub repository](${repository})`,
        `**❯ Branch:** ${childProcess
          .execSync('git rev-parse --abbrev-ref HEAD')
          .toString()}`,
      ])
      .setTimestamp();

    message.channel.send(embed);
  }
};
