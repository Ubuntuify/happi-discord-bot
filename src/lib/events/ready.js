const colors = require('colors/safe');
const Event = require('../structures/Event.js');

module.exports = class ready extends Event {
  constructor(...args) {
    super(...args, {
      once: true,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  run() {
    /* 🎀 Logs statistics into console during startup. */
    // eslint-disable-next-line
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
        `🤖 🟢 The client has successfully loaded ${colors.gray(
          this.client.events.size
        )} events.`,
        `🤖 🔴 Not yet implemented.`,
      ].join(`\n`)
    );

    // TODO: Add more features on start up.
  }
};
