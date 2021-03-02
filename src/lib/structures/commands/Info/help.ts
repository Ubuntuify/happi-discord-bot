/* eslint-disable class-methods-use-this */
import { Message, MessageEmbed } from 'discord.js';
import BaseCommand from '../../Command';

import * as Client from '../../../../Client';

module.exports = class extends BaseCommand {
  constructor(client: Client.Interface, name: string) {
    super(client, name, {
      cooldown: 10,
      aliases: [],
      args: false,
    });
  }

  public async run(message: Message, args: string[]): Promise<void> {
    if (args[0]) {
      /* 💫 checks and identifies with a code. */
      const command =
        this.client.commands.Commands.get(args[0]) ||
        this.client.commands.Commands.get(
          this.client.commands.Aliases.get(args[0])
        );

      if (command) {
        this.sendCommandEmbed(message, command);
      }
    }
  }

  private async sendCommandEmbed(
    message: Message,
    command: BaseCommand
  ): Promise<void> {
    const messageSent = await message.channel.send(
      '\\💫 Fetching command values..'
    );

    messageSent.edit('** **', {
      embed: new MessageEmbed()
        .setTitle(command.name)
        .setDescription(command.description)
        .addFields(
          { name: 'Category', value: command.category, inline: true },
          { name: 'Aliases', value: command.aliases.join(', '), inline: false },
          { name: 'Cooldown', value: command.cooldown, inline: true },
          { name: 'Usage', value: command.usage, inline: false }
        ),
    });
  }
};
