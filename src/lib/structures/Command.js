/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

const colors = require('colors/safe');
const Client = require('../../Client.js');

module.exports = class Command {
  /**
   * 📌 The main class for the commands.
   *
   * @param {Client} client The Client class instance initialized by index.
   * @param {String} name The name and command trigger phrase.
   * @param {Object} options The options for the command.
   *
   * @param {String} options.name The trigger phrase. (This will have a higher priority compared to the above name.)
   * @param {String[]} options.aliases The shorter versions of this command.
   * 
   * @param {Boolean} options.args Whether arguments exist for the command.
   * @param {String} options.usage How to use this command if arguments exist.
   * @param {String} options.description The command description.
   * @param {Number} options.timing The timing of the command.
   * @param {Boolean} options.ownerOnly If the command is exclusive to the owner.
   */
  constructor(client, name, options = {
    timing: 5,
    args: true,
  }) {
    this.client = client;
    this.name = options.name || name;
    this.aliases = options.aliases || [];

    this.category = options.category || 'Misc';
    this.description = options.description || 'No description was specified.';

    // This designates the options of the command.
    this.args = options.args;
    this.usage = options.usage || 'Impossible. Perhaps the archives are incomplete.';
    this.timing = options.timing;
    this.ownerOnly = options.ownerOnly || false;
  }

  async run(message, args) {
    throw new Error(
      `${colors.yellow('✖ ')} This run method was not implemented. See stacktrace for details.`
    );
  }

};
