/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

const colors = require('colors/safe');
const Client = require('../../Client.js');

module.exports = class Events {
  /**
   * 📌 The main class for the event listeners.
   *
   * @param {Client} client - The Client class instance initialized by index.
   * @param {String} name - The name of the event listened to.
   * @param {Object} options - The options of the your Event class.
   * @param {Boolean} options.once - Whether the event uses once or on.
   * @param {*} options.emitter This is handled by the loadEvents() method in /src/lib/Utility.
   */
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
