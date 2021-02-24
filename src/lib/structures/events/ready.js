/* eslint-disable global-require */
const colors = require('chalk');
const Event = require('../Event').default;

module.exports = class ReadyEvent extends Event {
  constructor(...args) {
    super(...args, {
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

    // TODO: Add more features on start up.
  }
};
