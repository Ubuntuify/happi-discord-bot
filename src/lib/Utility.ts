import { dirname, sep, parse } from 'path';
import { promisify } from 'util';
import { cyan, yellow, green } from 'chalk';
import ora from 'ora';

import Event from './structures/Event.js';
import Command from './structures/Command.js';
import { Interface } from '../Client';

const glob = promisify(require('glob'));

export default class Utility {
  client: Interface;

  constructor(client: Interface) {
    this.client = client;
  }

  // eslint-disable-next-line class-methods-use-this
  public isClass(input: any) {
    return (
      typeof input === 'function' &&
      typeof input.prototype === 'object' &&
      input.toString().substring(0, 5) === 'class'
    );
  }

  // eslint-disable-next-line class-methods-use-this
  get directory() {
    return `${dirname(require.main.filename)}${sep}`;
  }

  public async loadEvents() {
    return glob(`${this.directory}src/lib/structures/events/**/*.js`).then(
      (events: any) => {
        for (const eventFile of events) {
          delete require.cache[eventFile];
          const { name } = parse(eventFile);

          const loadSpinner = ora(`Loading event ${name}...`);

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
          event.emitter[event.type](name, (...args: any) => event.run(...args));

          // eslint-disable-next-line
          loadSpinner.succeed(`Completed loading ${cyan('event')} ${yellow(name)}.`);
        }
      }
    );
  }

  public async loadCommands() {
    return [this.loadCommandsExtension('js'), this.loadCommandsExtension('ts')];
  }

  private async loadCommandsExtension(extension: string) {
    glob(`${this.directory}src/lib/structures/commands/**/*.${extension}`).then(
      (commands: any) => {
        for (const commandFile of commands) {
          delete require.cache[commandFile];
          const { name } = parse(commandFile);
          const loadSpinner = ora(`Loading command ${name}...`);

          // eslint-disable-next-line
        const File = require(commandFile);
          if (!this.isClass(File))
            throw new TypeError(
              `Command ${name} does not export as class. (invalid type)`
            );

          const command = new File(this.client, name);
          if (!(command instanceof Command))
            throw new TypeError(
              `Command ${name} does not belong in Commands. (invalid extends)`
            );

          this.client.commands.commands.set(command.name, command);

          if (command.aliases.length)
            for (const alias of command.aliases) {
              this.client.commands.aliases.set(alias, command.name);
            }
          // eslint-disable-next-line
          loadSpinner.succeed(`Completed loading ${green('command')} ${yellow(name)}.`);
        }
      }
    );
  }
}
