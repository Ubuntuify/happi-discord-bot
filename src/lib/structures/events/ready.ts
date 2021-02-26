/* eslint-disable global-require */
import colors from 'chalk';

import Event from '../Event';
import * as Client from '../../../Client';

module.exports = class ReadyEvent extends Event {
  constructor(client: Client.Interface, name: string) {
    super(client, name, {
      once: true,
    });
  }

  async run() {
    /* 🎀 Logs statistics into console during startup. */
    const gitRevision = require('child_process')
      .execSync('git rev-parse HEAD')
      .toString()
      .trim()
      .slice(0, 7);

    console.log(
      [
        ``,
        `🔘 Git Repository Revision: ${colors.green(gitRevision)}`,
        ``,
        `🤖 🟢 Discord API is now online as${colors.yellow(
          this.client.user.username
        )}.`,
        `🤖 🟢 The client has successfully loaded${colors.gray(
          this.client.events.size
        )} events.`,
        `🤖 🟢 The client has successfully loaded${colors.gray(
          this.client.commands.Commands.size
        )} commands.`,
        ``,
      ].join(`\n`)
    );
  }
};
