/* eslint-disable class-methods-use-this */

import { Message } from 'discord.js';
import BaseCommand from '../../Command';
import * as Client from '../../../../Client';

module.exports = class RngCommand extends BaseCommand {
  /* 💔 Passes options to main class. */
  constructor(client: Client.Interface, name: string) {
    super(client, name, {
      category: 'Fun',
      cooldown: 5,
      aliases: ['dice', 'randomnumbergenerator', 'rollthedice'],
      args: false,
    });
  }

  /* 📡 This runs when the command is run. */
  public async run(message: Message, args: string[]): Promise<void> {
    /* 💫 sample code here. */
    const regExp: RegExp = /^\d+$/;

    /* ✨ tests for non-number arguments. */
    if (!regExp.test(args[0]) || !regExp.test(args[1])) {
      message.channel.send(
        'This request contains illegal characters. Please request with proper characters.'
      );
      return;
    }

    /* 💤 start of the algorithm. */
    const startRange = Number(args[0]);
    const endRange = Number(args[1]);
    const actualRange = endRange - startRange;

    if (startRange > endRange) {
      message.channel.send('This request contains an illegal range.');
      return;
    }

    const randomResult = this.generateRandomNumber([
      startRange,
      endRange,
      actualRange,
    ]);

    message.channel.send(
      `Randomly generated number was \`${await randomResult}\`. Range was \`${startRange}-${endRange}\`.`
    );
  }

  private async generateRandomNumber([
    startRange,
    endRange,
    actualRange,
  ]: number[]): Promise<number> {
    if (startRange === endRange) {
      return startRange;
    }
    return Math.floor(Math.random() * actualRange) + 1 + startRange;
  }
};
