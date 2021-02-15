const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const colors = require('colors/safe');

const Event = require('./structures/Event.js');

module.exports = class Utility {
  constructor(client) {
    this.client = client;
  }

  // eslint-disable-next-line class-methods-use-this
  isClass(input) {
    return (
      typeof input === 'function' &&
      typeof input.prototype === 'object' &&
      input.toString().substring(0, 5) === 'class'
    );
  }

  // eslint-disable-next-line class-methods-use-this
  get directory() {
    return `${path.dirname(require.main.filename)}${path.sep}`;
  }

  async loadEvents() {
    console.log(`💿 Loading events...`);

    return glob(`${this.directory}src/lib/events/**/*.js`).then((events) => {
      for (const eventFile of events) {
        delete require.cache[eventFile];

        const { name } = path.parse(eventFile);

        // eslint-disable-next-line
        const File = require(eventFile);
        if (!this.isClass(File))
          throw new TypeError(
            `Event ${name} does not export as Class. (invalid type)`
          );

        const event = new File(this.client, name);
        if (!(event instanceof Event))
          throw new TypeError(
            `Event ${name} does not belong. (invalid extends)`
          );

        this.client.events.set(event.name, event);
        event.emitter[event.type](name, (...args) => event.run(...args));
        console.log(`✅ Loaded ${colors.yellow(name)} as Event Class.`);
      }
    });
  }
};
