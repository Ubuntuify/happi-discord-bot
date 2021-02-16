/* eslint-disable no-useless-escape */
const { Collection, MessageEmbed } = require('discord.js');
const Events = require('../structures/Event.js');

module.exports = class MessageEvent extends Events {
  async run(message) {
    const { client } = this;

    // TODO: ✨ Make the prefix customizable per guild. ✨ \\
    const collections = client.commands;
    const prefix = '!';

    if (!message.content.startsWith(prefix)) return;
    message.channel.startTyping();

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!collections.commands.has(commandName)) return;
    const command = collections.commands.get(commandName);

    if (command.ownerOnly && message.author.id !== '323047832317591552') return;

    if (command.args && args.length)
      // TODO: Make this message more simple and readable.
      return message.channel.send(
        `\🤖 **User syntax error:** Mismatch identified.`
      );

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
      command.run(message, args);
      message.channel.stopTyping();
    } catch (err) {
      // TODO: handle ❌ errors ❌ via error handler.

      console.error(`That's not right.. Something went wrong here.\n${err}`);
      message.channel.send(
        `\❌ Something went wrong. We don't know what happened, but you have been given the error code \`#000\``
      );
    }
  }
};
