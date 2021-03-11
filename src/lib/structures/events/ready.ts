/* eslint-disable global-require */
import colors from 'chalk';
import { Mongoose } from 'mongoose';

import { ReadyState as MongoReadyState } from '../../helpers/mongo';
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
        /** Prints out git, discord, and API addon statuses. */
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

    await this.client.db.then((mongoose: Mongoose) => {
      console.log(
        /** Prints out the status of the mongoose connection. */
        `💥 ${
          MongoReadyState[mongoose.connection.readyState]
        } to mongo at ${colors.gray.underline(config.mongoPath)}`
      );
    });
  }
};
