/* eslint-disable class-methods-use-this */ /* eslint-disable no-eval */

import { Message, MessageEmbed } from 'discord.js';
import beautify from 'beautify';
import BaseCommand from '../../Command';
import * as Client from '../../../../Client';

module.exports = class EvaluateCommand extends BaseCommand {
  constructor(client: Client.Interface, name: string) {
    super(client, name, {
      category: 'Developer',
      timing: 10,
      aliases: ['eval'],
      args: true,
      ownerOnly: true,
    });
  }

  /* 📡 This runs when the command is run. */
  public async run(message: Message, args: string[]): Promise<void> {
    try {
      /* 💤 */ /* Compiles the code to evaluate. */
      const ToEvaluate = args.join(' ');

      if (ToEvaluate.toLowerCase().includes('token')) {
        message.channel
          .send(
            [
              "\\💤 This query includes illegal arguments. If this isn't",
              'expected behavior. You can create a pull request at',
              'https://github.com/RyanGamingXbox/happi-discord-bot',
            ].join(' ')
          )
          .then((sentMessage) => {
            sentMessage.suppressEmbeds(true);
          });
        return;
      }

      const Evaluate = eval(ToEvaluate);

      const BeautifyMessageEmbed: string = [
        '```javascript',
        beautify(ToEvaluate, { format: 'js' }),
        '```',
      ].join('\n');

      message.channel.send(
        new MessageEmbed()
          .setTitle('\\💫 Evaluation Report')
          .addFields(
            { name: 'Input', value: BeautifyMessageEmbed, inline: false },
            { name: 'Output', value: Evaluate, inline: false },
            { name: 'Type of Output', value: typeof Evaluate, inline: false }
          )
      );
    } catch (stacktrace) {
      const ErrorMessageEmbed = `\`\`\`javascript\n${stacktrace}\n\`\`\``;

      message.channel.send(
        new MessageEmbed()
          .setTitle('\\💫 Stacktrace Report')
          .setDescription(
            [
              'While evaluating your code, the process',
              'encountered an error. You may diagnose',
              'the error by checking the stacktrace',
              'below.',
            ].join('\n')
          )
          .addField('Stacktrace', ErrorMessageEmbed, false)
      );
    }
  }
};
