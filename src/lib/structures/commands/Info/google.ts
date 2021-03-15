import { Message, MessageEmbed } from 'discord.js';
import server from 'node-superfetch';
import BaseCommand from '../../Command';
import Client from '../../../../Client';

module.exports = class extends BaseCommand {
  constructor(client: Client, name: string) {
    super(client, name, {
      category: 'INFO',
      cooldown: 15,
      aliases: [],
      args: true,
    });
  }

  public async run(message: Message, args: string[]): Promise<void> {
    const { KEY, CSX } = this.client.ClientOptions.token.GOOGLE_API;
    const query = args.join(' ');

    const href: any = await search(query);
    if (!href) {
      super.returnError(message, 'INTERNAL_ERROR');
    }

    const embed = new MessageEmbed()
      .setTitle(href.title)
      .setDescription(href.snippet)
      .setImage(href.pagemap ? href.pagemap.cse_thumbnail[0].src : null)
      .setURL(href.link)
      .setColor(0x7289da)
      .setFooter('Powered by Google');

    message.reply(embed);

    async function search(q: string) {
      const { body }: any = await server
        .get(`https://www.googleapis.com/customsearch/v1`)
        .query({
          key: KEY,
          cx: CSX,
          safe: 'off',
          q,
        });

      if (!body.items) return null;
      return body.items[0];
    }
  }
};
