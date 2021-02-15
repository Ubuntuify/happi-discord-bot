/* eslint-disable no-useless-escape */
const { Collection, MessageEmbed } = require('discord.js');
const Events = require('../../structures/Event.js');

module.exports = class MessageEvent extends Events {
  async run(msg) {
    const { client } = this;

    // TODO: ✨ Make the prefix customizable per guild. ✨ \\
    const collections = client.commands;
    const prefix = '!';

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!collections.commands.has(commandName)) return;
    const command = collections.commands.get(commandName);

    if (command.ownerOnly && msg.author.id !== '323047832317591552') return;

    if (!args.length && command.args)
      return msg.reply(
        "Whoa. Something's missing here. Maybe, check what are you typing?"
      );

    /* === ✨ Tick, tock. The machine goes not. ✨ ===
    This section is cooldown handling. (Please note contributer:
    This should be at the end of all if gates. Do not code them
    below this point.) */
    if (!collections.timings.has(commandName)) {
      collections.timings.set(commandName, new Collection());
    }

    const timestamps = collections.timings.get(commandName);
    const cooldownAmount = command.timing * 1000;

    if (timestamps.has(msg.author.id)) {
      const untilExpiration = timestamps.get(msg.author.id) + cooldownAmount;
      if (!(Date.now() < untilExpiration)) {
        const TIME_LEFT = (untilExpiration - Date.now()) / 1000;
        msg.reply(
          new MessageEmbed()
            .setTitle('PANIK!')
            .setDescription(
              [
                "BEEP BOOP, BEEP BOOP. Please slow down, I can't keep",
                'going like this. I am glad I have a cooldown system',
                'as is.',
                '',
                `Please wait about \`${TIME_LEFT}\` seconds.`,
              ].join('\n')
            )
        );
        return;
      }
    }

    timestamps.set(msg.author.id, Date.now());
    setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);

    try {
      command.run(msg, args);
    } catch (err) {
      // TODO: handle errors via error handler.

      console.error(`That's not right.. Something went wrong here.\n${err}`);
      msg.channel.send(
        `\❌ Something went wrong. We don't know what happened, but you have been given the error code \`#000\``
      );
    }
  }
};
