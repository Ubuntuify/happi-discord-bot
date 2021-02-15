/* eslint-disable no-useless-escape */
const { Collection, MessageEmbed } = require('discord.js');
const Events = require('../structures/Event.js');

module.exports = class MessageEvent extends Events {
  async run(msg) {
    const { client } = this;
    const message = msg;

    // TODO: ✨ Make the prefix customizable per guild. ✨ \\
    const collections = client.commands;
    const prefix = '!';

    if (!message.content.startsWith(prefix)) return;
    message.channel.startTyping();

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!collections.commands.has(commandName)) return;
    const command = collections.commands.get(commandName);

    if (command.ownerOnly && msg.author.id !== '323047832317591552') return;

    if (command.args && args.length)
      // TODO: Make this message more simple and readable.
      return msg.channel.send(
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

    if (TIMESTAMPS_COLLECTION.has(msg.author.id)) {
      const EXPIRATION_TIME =
        TIMESTAMPS_COLLECTION.get(msg.author.id) + COOLDOWN_SECONDS;

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

        msg.reply(MESSAGE_ERROR_TIMING);
        return false;
      }
    }

    TIMESTAMPS_COLLECTION.set(msg.author.id, Date.now());
    setTimeout(
      () => TIMESTAMPS_COLLECTION.delete(msg.author.id),
      COOLDOWN_SECONDS
    );

    try {
      command.run(msg, args);
      message.channel.stopTyping();
    } catch (err) {
      // TODO: handle ❌ errors ❌ via error handler.

      console.error(`That's not right.. Something went wrong here.\n${err}`);
      msg.channel.send(
        `\❌ Something went wrong. We don't know what happened, but you have been given the error code \`#000\``
      );
    }
  }
};
