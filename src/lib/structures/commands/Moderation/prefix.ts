import { Message } from 'discord.js';
import { Mongoose } from 'mongoose';

import BaseCommand from '../../Command';
import Client from '../../../../Client';
import PrefixSchema from '../../../../schema/command-prefix-schema';

module.exports = class extends BaseCommand {
  constructor(client: Client, name: string) {
    super(client, name, {
      cooldown: 10,
      category: 'MOD',
      description: 'Change the prefix used in this guild.',
      aliases: [],
      args: true,
    });
  }

  public async run(message: Message, args: string[]): Promise<void> {
    const { member, guild } = message;
    const prefix = args.join(' ');

    if (!member.permissions.has('MANAGE_GUILD')) {
      super.returnError(message, 'NO_PERMISSION');
      return;
    }

    await this.client.db.then(async (mongoose: Mongoose) => {
      await PrefixSchema.findOneAndUpdate(
        {
          _id: guild.id,
        },
        {
          _id: guild.id,
          prefix,
        },
        {
          upsert: true,
        }
      );
      message.reply(
        `\\💥 The prefix has been updated to \`${prefix}\` successfully.`
      );
    });
  }
};
