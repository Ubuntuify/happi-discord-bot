/* eslint-disable no-useless-escape */

const ora = require('ora');
const { italic, bold } = require('chalk');

const { Collection, MessageEmbed } = require('discord.js');
const Events = require('../Event').default;

module.exports = class MessageCommandEvent extends Events {
  async run(message) {
    // TODO: ✨ Make the prefix customizable per guild. ✨ \\
    const collections = this.client.commands;
    const mentionRegex = `<@!${this.client.user.id}>`;
    const { prefix } = require('../../../app/config/main-config.json');

    if (message.content.startsWith(mentionRegex))
      message.channel.send(
        `Oh, hello there. You'll probably want my prefix. My prefix is ${prefix}`
      );

    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    message.channel.startTyping();
    const requestLoader = ora(
      `Processing request of ${message.author.username} ${bold(
        `${commandName}`
      )}`
    ).start();

    if (!collections.commands.has(commandName)) return;
    const command = collections.commands.get(commandName);

    if (command.ownerOnly && message.author.id !== '323047832317591552') return;

    if (command.args && args.join(' ').length <= 0) {
      message.channel.stopTyping();
      message.channel.send(
        new MessageEmbed()
          // eslint-disable-next-line prettier/prettier
          .setTitle('\:x: Query Error')
          .setDescription(
            [
              `You did not provide the sufficient`,
              `amount of arguments. Please send`,
              `the proper amount again.`,
            ].join('\n')
          )
          .setFooter(
            `Check my git repository!`,
            this.client.user.displayAvatarURL()
          )
          .setTimestamp(message.createdTimestamp)
      );
      return;
    }

    /* === ✨ Tick, tock. The machine goes not. ✨ ===
    This section is cooldown handling. (Please note contributer:
    This should be at the end of all if gates. Do not code them
    below this point.) */
    if (!collections.timings.has(commandName)) {
      collections.timings.set(commandName, new Collection());
    }

    // FIXME: Cooldown system isn't working properly. Please debug later.
    const TIMESTAMPS_COLLECTION = collections.timings.get(commandName);
    const COOLDOWN_SECONDS = command.timing * 1000;

    if (TIMESTAMPS_COLLECTION.has(message.author.id)) {
      const EXPIRATION_TIME =
        TIMESTAMPS_COLLECTION.get(message.author.id) + COOLDOWN_SECONDS;

      if (!(Date.now() < EXPIRATION_TIME)) {
        const TIME_LEFT = (EXPIRATION_TIME - Date.now()) / 1000;
        const MESSAGE_ERROR_TIMING = new MessageEmbed()
          .setTitle("It's time to panic.")
          .setDescription(
            [
              "BEEP BOOP, BEEP BOOP. Please slow down, I can't keep",
              'going like this. I am glad I have a cooldown system',
              'as is.',
              '',
              `Please wait about \`${TIME_LEFT}\` seconds.`,
            ].join('\n')
          );

        message.reply(MESSAGE_ERROR_TIMING);
        return false;
      }
    }

    TIMESTAMPS_COLLECTION.set(message.author.id, Date.now());
    setTimeout(
      () => TIMESTAMPS_COLLECTION.delete(message.author.id),
      COOLDOWN_SECONDS
    );

    try {
      await command.run(message, args);
      requestLoader.succeed(
        `Completed request by ${message.author.username} ${bold(commandName)}`
      );
      message.channel.stopTyping();
    } catch (err) {
      // TODO: handle ❌ errors ❌ via error handler.

      console.error(`That's not right.. Something went wrong here.\n${err}`);
      message.channel.send(
        `\❌ Something went wrong. We don't know what happened, but you have been given the error code \`#000\``
      );
      requestLoader.fail(
        `Failed request by ${message.author.username} ${bold(commandName)}`
      );
    }
  }
};
