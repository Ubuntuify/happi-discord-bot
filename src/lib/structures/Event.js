/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

const colors = require('colors/safe');

module.exports = class Events {
  constructor(client, name, options = {}) {
    this.name = name;
    this.client = client;
    this.type = options.once ? 'once' : 'on';
    this.emitter =
      (typeof options.emitter === 'string'
        ? this.client[options.emitter]
        : options.emitter) || this.client;
  }

  async run(...args) {
    throw new Error(
      // eslint-disable-next-line prettier/prettier
      `${colors.yellow('✖ ')} This run method has not been implemented. See stacktrace for details.`
    );
  }
};
