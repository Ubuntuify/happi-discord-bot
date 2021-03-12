/* eslint-disable class-methods-use-this */

import { Message } from 'discord.js';
import BaseCommand from '../../Command';
import Client from '../../../../Client';

module.exports = class extends BaseCommand {
  /* 💔 Passes options to main class. */
  constructor(client: Client, name: string) {
    super(client, name, {
      category: 'FUN',
      cooldown: 5,
      aliases: ['dice', 'randomnumbergenerator', 'rollthedice', 'rng'],
      args: false,
    });
  }

  /* 📡 This runs when the command is run. */
  public async run(message: Message, args: string[]): Promise<void> {
    /* 💫 sample code here. */
    const regExp: RegExp = /^\d+$/;

    /* ✨ tests for non-number arguments. */
    if (!regExp.test(args[0]) || !regExp.test(args[1])) {
      message.reply(
        'This request contains illegal characters. Please request with proper characters.'
      );
      return;
    }

    /* 💤 start of the algorithm. */
    const startRange = Number(args[0]);
    const endRange = Number(args[1]);
    const actualRange = endRange - startRange;

    if (startRange > endRange) {
      message.reply('This request contains an illegal range.');
      return;
    }

    const randomResult = this.generateRandomNumber([
      startRange,
      endRange,
      actualRange,
    ]);

    message.reply(
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
