import { dirname, sep, parse } from 'path';
import { promisify } from 'util';

import Event from './structures/Event';
import Command from './structures/Command';
import Interface from '../Client';

const glob = promisify(require('glob'));

export default class Utility {
  private client: Interface;

  constructor(client: Interface) {
    this.client = client;
  }

  // eslint-disable-next-line class-methods-use-this
  public isClass(input: any): boolean {
    return (
      typeof input === 'function' &&
      typeof input.prototype === 'object' &&
      input.toString().substring(0, 5) === 'class'
    );
  }

  /* eslint-disable-next-line class-methods-use-this */
  formatBytes(bytes: number) {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    /* eslint-disable-next-line no-restricted-properties */
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  }

  /* eslint-disable-next-line */
  trimArray(arr: string[], maxLen = 10) {
    if (arr.length > maxLen) {
      const len = arr.length - maxLen;
      /* eslint-disable-next-line no-param-reassign */
      arr = arr.slice(0, maxLen);
      arr.push(`${len} more...`);
    }
    return arr;
  }

  /* eslint-disable-next-line class-methods-use-this */
  get directory(): string {
    return `${dirname(require.main.filename)}${sep}`;
  }

  public async loadEvents(): Promise<void> {
    return glob(`${this.directory}src/lib/structures/events/**/*.ts`).then(
      (events: any) => {
        for (const eventFile of events) {
          delete require.cache[eventFile];
          const { name } = parse(eventFile);

          try {
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
            event.emitter[event.type](name, (...args: any) =>
              event.run(...args)
            );
          } catch (stacktrace) {
            console.error(`\n${stacktrace}`);
          }
        }
      }
    );
  }

  public async loadCommands(): Promise<void> {
    glob(`${this.directory}src/lib/structures/commands/**/*.ts`).then(
      (commands: any) => {
        for (const commandFile of commands) {
          delete require.cache[commandFile];
          const { name } = parse(commandFile);

          // eslint-disable-next-line
          const File = require(commandFile);

          try {
            if (!this.isClass(File))
              throw new TypeError(
                `Command ${name} does not export as class. (Invalid Module Type)`
              );

            const command = new File(this.client, name);
            if (!(command instanceof Command))
              throw new TypeError(
                `Command ${name} does not belong in Commands. (Invalid Extends)`
              );

            this.client.commands.Commands.set(command.name, command);

            if (command.aliases.length)
              for (const alias of command.aliases) {
                this.client.commands.Aliases.set(alias, command.name);
              }
          } catch (stacktrace) {
            console.error(`\n${stacktrace}`);
          }
        }
      }
    );
  }
}
