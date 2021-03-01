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
    const messageSent = message.channel.send('\\💫 Fetching command values..');
  }
};
