/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

import { yellow } from 'chalk';
import * as Client from '../../Client';

export default class Events {
  name: string;
  client: Client.Interface;
  type: string;
  emitter: any;

  /**
   * 📌 The main class for the event listeners.
   *
   * @param {Client} client - The Client class instance initialized by index.
   * @param {String} name - The name of the event listened to.
   * @param {Object} options - The options of the your Event class.
   * @param {Boolean} options.once - Whether the event uses once or on.
   * @param {*} options.emitter This is handled by the loadEvents() method in /src/lib/Utility.
   */
  constructor(client: Client.Interface, name: string, options: any = {}) {
    this.name = name;
    this.client = client;
    this.type = options.once ? 'once' : 'on';
    this.emitter =
      (typeof options.emitter === 'string'
        ? this.client[options.emitter]
        : options.emitter) || this.client;
  }

  async run(...args: any) {
    throw new Error(
      // eslint-disable-next-line prettier/prettier
      `${yellow('✖ ')} This run method has not been implemented. See stacktrace for details.`
    );
  }
}
