/* eslint-disable class-methods-use-this */

import { Message, MessageEmbed } from 'discord.js';
import childProcess from 'child_process';
import BaseCommand from '../../Command';
import * as Client from '../../../../Client';

module.exports = class extends BaseCommand {
  /* 💔 Passes options to main class. */
  constructor(client: Client.Interface, name: string) {
    super(client, name, {
      cooldown: 10,
      description:
        'Checks the current state of the git repository, this bot is in.',
      aliases: ['gitstatus', 'gitstats', 'githubstatus', 'githubstats'],
      args: false,
    });
  }

  /* 📡 This runs when the command is run. */
  public async run(message: Message): Promise<void> {
    /* 💫 sample code here. */
    const GitStatus = this.gitHash;
    const GitBranch = this.gitBranch;

    const GitStatusEmbed = new MessageEmbed()
      .setTimestamp()
      .setAuthor(
        'Git Status • happi-discord-bot',
        'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        'https://github.com/RyanGamingXbox/happi-discord-bot'
      )
      .addFields(
        { name: 'Git Commit', value: GitStatus, inline: true },
        { name: 'Git Branch', value: GitBranch, inline: true }
      );

    message.channel.send(GitStatusEmbed);
  }

  private get gitHash(): string {
    return childProcess
      .execSync('git rev-parse HEAD')
      .toString()
      .trim()
      .slice(0, 7);
  }

  private get gitBranch(): string {
    return childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString();
  }
};
