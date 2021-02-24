import { Message, MessageEmbed, Collection } from 'discord.js';
import { Interface } from '../../../../Client';

import BaseCommand from '../../Command';

interface Command {
  name: string;
  aliases: string[];
  category: string;
  description: string;
  usage: string;
  timing: number;
  ownerOnly: boolean;
}

module.exports = class HelpCommand extends BaseCommand {
  constructor(client: Interface, name: string) {
    super(client, name, {
      description: 'Lists commands, gets command usage and information.',
      category: 'Info',
      args: false,
      timing: 15,
    });
  }

  public async run(message: Message, args: string[]): Promise<void> {
    const collection: Collection<any, any> = this.client.commands.Commands;

    if (args[0]) {
      if (collection.has(args[0])) {
        const command: Command = collection.get(args[0]);
        const commandEmbed = this.generateCommandEmbed(command);

        message.channel.send(await commandEmbed);
        return;
      }

      // TODO: Code during category search. (Some flaws but I hope it'll be okay.)
      if (collection.some((command) => command.category === args[0])) {
        const category = collection.filter(
          (command) => command.category === args[0]
        );
      }
      return;
    }

    console.log('wip.');
  }

  // eslint-disable-next-line class-methods-use-this
  private async generateCommandEmbed({
    name,
    aliases,
    category,
    description,
    usage,
    timing,
    ownerOnly,
  }: Command): Promise<MessageEmbed> {
    let embedAliases: string;

    if (aliases.length === 0) {
      embedAliases = 'There are no aliases defined for this command.';
    } else embedAliases = aliases.join(', ');

    return new MessageEmbed()
      .setTitle(`${name}`)
      .setTimestamp()
      .addFields(
        { name: 'Description', value: description, inline: false },
        { name: 'Category', value: category, inline: false },
        { name: 'Aliases', value: embedAliases, inline: false },
        { name: 'Timing', value: timing, inline: true },
        {
          name: 'Usage',
          value: usage || 'Sadly, this does not apply.',
          inline: true,
        },
        { name: 'Owner Only', value: ownerOnly ? 'Yes.' : 'No.', inline: false }
      );
  }
};
