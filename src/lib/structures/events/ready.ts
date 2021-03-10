/* eslint-disable global-require */
import colors from 'chalk';

import config from '../../../app/config/main_config.json';
import Event from '../Event';
import Client from '../../../Client';

module.exports = class extends Event {
  constructor(client: Client, name: string) {
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
        `💫 Git Repository Revision: ${colors.green(gitRevision)}`,
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

    await this.client.db.then((mongoose) => {
      try {
        console.log(
          `💥 Connected to mongo at ${colors.gray.underline(config.mongoPath)}`
        );
      } finally {
        mongoose.connection.close();
      }
    });
  }
};
