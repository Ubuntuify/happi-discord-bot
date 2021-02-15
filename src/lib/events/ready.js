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
    console.log(
      [
        ``,
        `🤖 🟢 Discord API is now online as${colors.yellow(
          this.client.user.username
        )}.`,
        `🤖 🟢 The client has successfully loaded ${this.client.events.size} events.`,
        `🤖 🔴 Not yet implemented.`,
      ].join(`\n`)
    );

    // TODO: Add more features on start up.
  }
};
