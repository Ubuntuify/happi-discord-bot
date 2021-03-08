/* eslint-disable no-nested-ternary */
/* eslint-disable class-methods-use-this */

import { Message, MessageEmbed } from 'discord.js';
import moment from 'moment';
import BaseCommand from '../../Command';
import Client from '../../../../Client';
import Utility from '../../../Utility';

const flags = {
  DISCORD_EMPLOYEE: 'Discord Employee',
  DISCORD_PARTNER: 'Discord Partner',
  BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
  BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
  HYPESQUAD_EVENTS: 'HypeSquad Events',
  HOUSE_BRAVERY: 'House of Bravery',
  HOUSE_BRILLIANCE: 'House of Brilliance',
  HOUSE_BALANCE: 'House of Balance',
  EARLY_SUPPORTER: 'Early Supporter',
  TEAM_USER: 'Team User',
  SYSTEM: 'System',
  VERIFIED_BOT: 'Verified Bot',
  VERIFIED_DEVELOPER: 'Verified Bot Developer',
};

module.exports = class extends BaseCommand {
  constructor(client: Client, name: string) {
    super(client, name, {
      cooldown: 10,
      aliases: [],
      args: false,
    });
  }

  public async run(message: Message, [target]): Promise<void> {
    const member =
      message.mentions.members.last() ||
      message.guild.members.cache.get(target) ||
      message.member;
    const roles = member.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString())
      .slice(0, -1);
    const userFlags = member.user.flags.toArray();
    const embed = new MessageEmbed()
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setColor(member.displayHexColor || 'BLUE')
      .addField('User', [
        `**❯ Username:** ${member.user.username}`,
        `**❯ Discriminator:** ${member.user.discriminator}`,
        `**❯ ID:** ${member.id}`,
        `**❯ Flags:** ${
          userFlags.length
            ? userFlags.map((flag) => flags[flag]).join(', ')
            : 'None'
        }`,
        `**❯ Avatar:** [Link to avatar](${member.user.displayAvatarURL({
          dynamic: true,
        })})`,
        `**❯ Time Created:** ${moment(member.user.createdTimestamp).format(
          'LT'
        )} ${moment(member.user.createdTimestamp).format('LL')} ${moment(
          member.user.createdTimestamp
        ).fromNow()}`,
        `**❯ Status:** ${member.user.presence.status}`,
        `**❯ Game:** Could not get guild information.`,
        `\u200b`,
      ])
      .addField('Member', [
        `**❯ Highest Role:** ${
          member.roles.highest.id === message.guild.id
            ? 'None'
            : member.roles.highest.name
        }`,
        `**❯ Server Join Date:** ${moment(member.joinedAt).format('LL LTS')}`,
        `**❯ Hoist Role:** ${
          member.roles.hoist ? member.roles.hoist.name : 'None'
        }`,
        `**❯ Roles [${roles.length}]:** ${
          roles.length < 10
            ? roles.join(', ')
            : roles.length > 10
            ? Utility.prototype.trimArray(roles)
            : 'None'
        }`,
        `\u200b`,
      ]);
    message.channel.send(embed);
  }
};
