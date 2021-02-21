/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
/* eslint-disable no-eval */
const beautify = require('beautify');
const { MessageEmbed } = require('discord.js');
const Command = require('../../Command');

module.exports = class EvaluateCommand extends Command {
  constructor(client, name) {
    super(client, name, {
      name: 'eval',
      description: 'A developer debugging tool that can help future features.',
      args: true,
      usage: '(code to evaluate)',
      timing: 0,
      ownerOnly: true,
    });
  }

  async run(message, args) {
    // These will simulate more usual evaluate
    // expressions that will be more similar to
    // other discord.js programs.
    const { client } = this;

    if (args.join(` `).includes(`token`))
      return message.channel.send(
        new MessageEmbed()
          .setTitle(`\:x: Query Error.`)
          .setDescription(
            [
              `Your query could not be processed. Maybe`,
              `check the git repository and make a PR.`,
            ].join('\n')
          )
      );

    try {
      const EVAL_TARGET = await args.join(` `);
      const EVAL = await eval(EVAL_TARGET);

      const EVAL_TARGET_REPLY = [
        '```js',
        beautify(EVAL_TARGET, { format: 'js' }),
        '```',
      ].join('\n');
      const EVAL_TYPE = typeof EVAL;

      const MESSAGE_REPLY = new MessageEmbed()
        .setTitle(`\:robot: Query Result`)
        .addFields(
          {
            name: `What was evaluated.`,
            value: EVAL_TARGET_REPLY,
            inline: false,
          },
          { name: `What was returned.`, value: EVAL, inline: false },
          {
            name: `Type of returned.`,
            value: `\`${EVAL_TYPE}\``,
            inline: false,
          }
        );

      message.channel.send(MESSAGE_REPLY);
    } catch (err) {
      const REQUEST_FAILED_RESPONSE = new MessageEmbed()
        .setTitle(`\:x: Query Failed`)
        .setDescription(
          [
            `The code you attempted to run was`,
            `not able to execute and encountered`,
            `an error`,
          ].join('\n')
        )
        .addFields({
          name: `Stacktrace`,
          value: [`\`\`\`js`, err, `\`\`\``].join(`\n`),
          inline: true,
        });

      message.channel.send(REQUEST_FAILED_RESPONSE);
    }
  }
};
