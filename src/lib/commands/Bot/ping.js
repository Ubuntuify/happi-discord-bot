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

    message.channel.send(
      new MessageEmbed()
        // eslint-disable-next-line
        .setTitle('\✨ Ping')
        .setDescription(
          [
            `**Websocket Ping** ${WS_PING}ms`,
            `**Effective Ping** ${CALCULATED_PING}ms`,
          ].join('\n')
        )
        .addFields({
          name: 'Hypixel API',
          value: `${await this.client.wrappers.hypixel.getPing()}`,
          inline: true,
        })
    );
  }
};
