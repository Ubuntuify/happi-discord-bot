/* eslint-disable no-useless-escape */
const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/Command');

module.exports = class PingCommand extends Command {
  constructor(...args) {
    super(...args, {
      args: false,
      description: "Checks the bot's connection to the server.",
    });
  }

  async run(message) {
    const WS_PING = this.client.ws.ping;
    const CALCULATED_PING = (await message.createdTimestamp) - Date.now();

    const HYPIXEL_PING = await this.client.wrappers.hypixel.getPing();

    message.channel.send(
      new MessageEmbed()
        // eslint-disable-next-line
        .setTitle('\✨ Ping')
        .addFields(
          {
            name: 'Websocket Ping',
            value: `${WS_PING}ms`,
            inline: true,
          },
          {
            name: 'Effective Ping',
            value: `${CALCULATED_PING}ms`,
            inline: true,
          },
          {
            name: 'Hypixel API',
            value: `${HYPIXEL_PING}ms`,
            inline: true,
          }
        )
    );
  }
};
