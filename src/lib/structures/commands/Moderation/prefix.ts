/* eslint-disable class-methods-use-this */

import { Message } from 'discord.js';
import { readFileSync, writeFileSync } from 'fs';
import Utility from '../../../Utility';
import BaseCommand from '../../Command';
import * as Client from '../../../../Client';

module.exports = class extends BaseCommand {
  constructor(client: Client.Interface, name: string) {
    super(client, name, {
      cooldown: 10,
      category: 'Moderation',
      aliases: [],
      args: true,
    });
  }

  public async run(message: Message, args: string[]): Promise<void> {
    const { directory } = Utility.prototype;

    if (!message.member.hasPermission('MANAGE_GUILD')) {
      super.returnError(message, 'NO_PERMISSION');
      return;
    }

    const prefixes = JSON.parse(
      readFileSync(`${directory}/src/srv/guild.json`, {
        encoding: 'utf-8',
      })
    );

    prefixes[message.guild.id] = {
      prefix: args[0],
    };

    writeFileSync(`${directory}/src/srv/guild.json`, JSON.stringify(prefixes));

    message.channel.send(`Setting \`prefix\` has been set to \`${args[0]}\`.`);
  }
};
